import { defineConfig } from "changelogithub";

export default defineConfig({
	group: 'multiple',
	// @ts-expect-error: until https://github.com/unjs/changelogen/pull/113 is released
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
