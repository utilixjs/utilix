import { emptyDirSync } from "fs-extra";
import { defineConfig, type RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const bundle = (options: RollupOptions) => ({
	...options,
	input: 'src/index.ts'
});

emptyDirSync('./dist');

const config = defineConfig([
	bundle({
		plugins: [esbuild({
			target: 'es2017'
		})],
		output: [
			{
				file: `dist/index.cjs`,
				format: 'cjs'
			},
			{
				file: `dist/index.global.js`,
				format: 'iife',
				name: 'u'
			},
			{
				file: `dist/index.js`,
				format: 'es'
			}
		]
	}),
	bundle({
		plugins: [dts()],
		output: {
			file: `dist/index.d.ts`,
			format: 'es'
		}
	})
]);

export default config;