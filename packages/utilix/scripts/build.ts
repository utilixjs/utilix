import path from "path";
import { execSync } from "child_process";
import { emptyDir } from "fs-extra";
import { rollup, type RollupOptions, type RollupBuild } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import tsconfigPaths from "rollup-plugin-tsconfig-paths";

console.group("⚙️ Preparing for build");

await (await import("./updateImports")).updateImports();

const { mainModule, rootDir } = await import("./modules");
const distDir = path.join(rootDir, 'dist/');
const moduleInputs: RollupOptions['input'] = { 'index': mainModule.index };

mainModule.modules.forEach(c => {
	moduleInputs[`${c.name}/index`] = c.index;
	c.modules.forEach(m => {
		moduleInputs[`${c.name}/${m.name}/index`] = m.index;
	});
});

await emptyDir(distDir);

console.log("Type checking...");
execSync('pnpm typecheck', { stdio: 'inherit' });

const esbuildPlugin = esbuild({
	target: 'es2020',
	minify: true
});
const tsconfigPathsPlugin = tsconfigPaths();

async function build(options: RollupOptions) {
	let bundle: RollupBuild | undefined;
	let buildFailed = false;
	try {
		bundle = await rollup(options);
		await generateOutputs(bundle, options.output);
	} catch (error) {
		buildFailed = true;
		console.error(error);
	}
	if (bundle) {
		await bundle.close();
	}
	if (buildFailed) {
		process.exit(1);
	}
}

async function generateOutputs(bundle: RollupBuild, outputOpts: RollupOptions['output']) {
	outputOpts = (outputOpts && !Array.isArray(outputOpts)) ? [outputOpts] : (outputOpts ?? []);

	for (const outputOptions of outputOpts) {
		await bundle.write(outputOptions);
	}
}

console.groupEnd();
console.group("⚙️ Bundling ESM & CJS modules");

await build({
	input: moduleInputs,
	plugins: [tsconfigPathsPlugin, esbuildPlugin],
	output: [
		{
			dir: distDir,
			entryFileNames: `[name].cjs`,
			format: 'cjs'
		},
		{
			dir: distDir,
			entryFileNames: `[name].js`,
			format: 'es'
		}
	]
});

console.groupEnd();
console.group("⚙️ Bundling TS type definitions");

await build({
	input: moduleInputs,
	plugins: [tsconfigPathsPlugin, dts({
		compilerOptions: {
			composite: false
		}
	})],
	output: {
		dir: distDir,
		entryFileNames: `[name].d.ts`,
		format: 'es'
	}
});

console.groupEnd();
console.group("⚙️ Bundling IIFE globals");

function getIIFEConfig(input: string, outputFile: string): RollupOptions {
	return {
		input: input,
		plugins: [tsconfigPathsPlugin, esbuildPlugin],
		output: {
			file: path.join(distDir, `${outputFile}.global.js`),
			format: 'iife',
			name: 'u',
			extend: true
		}
	};
}

await Promise.all(Object.entries(moduleInputs).map(([output, input]) => build(getIIFEConfig(input, output))));

console.groupEnd();
console.info("🚀 Build finished successfully");
