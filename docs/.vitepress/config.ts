import { defineConfig } from 'vitepress';

const title = "Utilix";
const description = "Modern and flexible utilities library for JavaScript";
const ogImg = 'https://utilix.dev/media/og.png';

export default defineConfig({
	lang: 'en-US',
	title,
	description,

	head: [
		['link', { rel: 'icon', type: 'image/png', href: '/media/logo/u4t1x1-256.png' }],
		['meta', { name: 'theme-color', content: '#ce996a' }],
		['meta', { property: 'og:title', content: title }],
		['meta', { property: 'og:description', content: description }],
		['meta', { property: 'og:image', content: ogImg }],
		['meta', { name: 'twitter:card', content: 'summary_large_image' }],
		['meta', { name: 'twitter:creator', content: '@waleed1kh' }],
		['meta', { name: 'twitter:image', content: ogImg }],
	],

	cleanUrls: true,
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
