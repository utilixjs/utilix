import eslint from '@eslint/js';
import tseslint, { type Config } from 'typescript-eslint';

const config: Config = tseslint.config(
	{ ignores: ['node_modules', '**/dist', '**/cache', '**/*.local.*'] },

	eslint.configs.recommended,
	{
		rules: {
			'indent': ['error', 'tab', { 'SwitchCase': 1 }],
			'semi': ['error', 'always'],
			'no-empty': ["error", { "allowEmptyCatch": true }],
			'prefer-const': 'warn'
		}
	},

	/* ------------- TypeScript ------------- */
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				project: ['packages/*/tsconfig.json', 'docs/tsconfig.json', 'tsconfig.node.json', 'tsconfig.json'],
				tsconfigRootDir: __dirname // import.meta.dirname
			}
		}
	},
	{
		rules: {
			'@typescript-eslint/array-type': 'warn',
			'@typescript-eslint/ban-ts-comment': ['warn', {
				'ts-expect-error': 'allow-with-description',
				'ts-ignore': 'allow-with-description',
				'ts-nocheck': true,
				'ts-check': false,
				minimumDescriptionLength: 3
			}],
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-for-in-array': 'error',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', {
				varsIgnorePattern: '^_',
				argsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_'
			}]
		}
	}
);

export default config;
