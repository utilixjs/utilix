import { fileURLToPath, URL } from 'url'
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		minify: false,
		lib: {
			formats: ['es', 'cjs', 'iife'],
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'u',
			fileName: 'index'
		}
	},
	plugins: [dts({
		copyDtsFiles: true,
	})],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
});
