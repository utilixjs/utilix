import { defineConfig } from 'tsup'

export default defineConfig({
	target: 'es2020',
	platform: 'browser',
	entry: ['src/index.ts'],
	format: ['iife', 'cjs', 'esm'],
	globalName: 'u',
	dts: true,
	clean: true,
})