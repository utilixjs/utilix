import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@internal': fileURLToPath(new URL('./src/_internal', import.meta.url)),
		}
	}
});
