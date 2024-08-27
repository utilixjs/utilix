import { h } from 'vue';
import type { Theme as ThemeType } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import 'virtual:uno.css';
import './style.css';

const theme: ThemeType = {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {});
	},
	enhanceApp() {
	}
};

export default theme;
