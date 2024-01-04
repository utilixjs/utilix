import { h } from 'vue';
import type { Theme as ThemeType } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';

const theme: ThemeType = {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
		});
	},
	enhanceApp({ app, router, siteData }) {
	}
};

export default theme;
