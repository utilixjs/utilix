import path from "path";
import { emptyDirSync } from "fs-extra";
import { rollup, type RollupOptions, type RollupBuild } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { mainModule, rootDir } from "./modules";
import { updateImports } from "./updateImports";

console.info("⚙️  Preparing for build");

await updateImports();

const distDir = path.join(rootDir, 'dist/');
const moduleInputs: RollupOptions['input'] = { 'index': mainModule.index };

mainModule.modules.forEach(c => {
	moduleInputs[`${c.name}/index`] = c.index;
	c.modules.forEach(m => {
		moduleInputs[`${c.name}/${m.name}/index`] = m.index;
	});
});

emptyDirSync(distDir);

const esbuildPlugin = esbuild({
	target: 'es2017',
	minify: true
});

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

console.info("⚙️  Bundling ESM & CJS modules");

await build({
	input: moduleInputs,
	plugins: [esbuildPlugin],
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

console.info("⚙️  Bundling TS type definitions");

await build({
	input: moduleInputs,
	plugins: [dts()],
	output: {
		dir: distDir,
		entryFileNames: `[name].d.ts`,
		format: 'es'
	}
});

console.info("⚙️  Bundling IIFE globals");

function getIIFEConfig(input: string, outputFile: string): RollupOptions {
	return {
		input: input,
		plugins: [esbuildPlugin],
		output: {
			file: path.join(distDir, `${outputFile}.global.js`),
			format: 'iife',
			name: 'u',
			extend: true
		}
	};
}

await Promise.all(Object.entries(moduleInputs).map(([output, input]) => build(getIIFEConfig(input, output))));

console.info("🚀 Build finished successfully");
