import { defineConfig, type DefaultTheme } from 'vitepress';
import Inspect from 'vite-plugin-inspect';
import { docExporter, moduleDocTransform, UModulePathRegex } from './plugins'
import { modules } from '../../packages/utilix/scripts/modules';

const title = "Utilix";
const description = "Modern and flexible utilities library for JavaScript";
const ogImg = 'https://utilix.dev/media/og.png';

const exporterPlugin = docExporter();
const transformPlugin = moduleDocTransform();

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

	srcDir: '../',
	srcExclude: ['**/README.md'],
	vite: {
		publicDir: 'docs/public',
		plugins: [
			Inspect(),
			exporterPlugin,
			transformPlugin,
		]
	},

	rewrites: {
		'packages/utilix/src/:cat/:func/index.md': 'modules/:cat/:func.md',
		'docs/:md.md': ':md.md',
		'docs/guide/:md.md': 'guide/:md.md'
	},

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
			},
			...getModulesSidebarItems()
		],

		search: {
			provider: 'local',
			options: {
				_render(src, env, md) {
					if (env.frontmatter?.search === false || env.relativePath.startsWith('CODE_OF_CONDUCT')) {
						return '';
					}

					const match = env.relativePath.match(UModulePathRegex);
					if (match) {
						src = transformPlugin.api.transform(src, match[1]);
					}

					return md.render(src, env);
				}
			}
		},

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/utilixjs/utilix' }
		],

		footer: {
			message: "MIT License, Made with ❤️",
			copyright: `© ${(new Date()).getFullYear()} <a href="https://github.com/Waleed-KH" class="link">Waleed-KH</a>`
		}
	}
});

function getModulesSidebarItems(): DefaultTheme.SidebarItem[] {
	return modules.filter(c => c.modules.some(m => m.doc)).map(c => ({
		text: c.name.charAt(0).toUpperCase() + c.name.slice(1),
		collapsed: true,
		items: c.modules.filter(m => m.doc).map(m => ({ text: m.name, link: `/modules/${c.name}/${m.name}` }))
	}));
}
