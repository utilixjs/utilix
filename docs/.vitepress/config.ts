import { defineConfig } from 'vitepress'

export default defineConfig({
	lang: 'en-US',
	title: "Utilix",
	description: "A modern and flexible utilities library for JavaScript",

	head: [
		['link', { rel: 'icon', type: 'image/png', href: '/media/logo/u4t1x1-256.png' }],
		['meta', { name: 'theme-color', content: '#ce996a' }],
	],

	themeConfig: {
		logo: { src: '/media/logo/u4ts.png' },

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
		],

		footer: {
			message: "MIT License, Made with ❤️",
			copyright: `© ${(new Date()).getFullYear()} <a href="https://github.com/Waleed-KH" class="link">Waleed-KH</a>`
		}
	}
});
