import { defineConfig } from 'vitepress'

export default defineConfig({
	title: "Utilix",
	description: "A modern and flexible utilities library for JavaScript",
	themeConfig: {
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Guide', link: '/guide/' }
		],

		sidebar: [
			{
				text: 'Guide',
				items: [
					{ text: 'Getting Started', link: '/guide/' },
				]
			}
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/utilixjs/utilix' }
		]
	}
});
