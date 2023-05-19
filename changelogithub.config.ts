import { defineConfig } from "changelogithub";

export default defineConfig({
	types: {
		feat: { title: '🚀 Features' },
		fix: { title: '🐞 Bug Fixes' },
		perf: { title: '🏎 Performance' },
		refactor: { title: '💅 Refactors' },
		docs: { title: '📖 Documentation' },
		test: { title: '🧪 Tests' },
		build: { title: '📦 Build' },
		ci: { title: '🤖 CI' }
	}
} as any);