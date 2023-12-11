import { defineConfig } from "changelogithub";

export default defineConfig({
	group: 'multiple',
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
});
