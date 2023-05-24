/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended"
	],
	env: {
		es2021: true,
		node: true
	},
	rules: {
		"indent": ["error", "tab"],
		"semi": ["error", "always"],

		"@typescript-eslint/array-type": "warn",
		"@typescript-eslint/ban-ts-comment": ["warn", {
			"ts-expect-error": "allow-with-description",
			"ts-ignore": "allow-with-description",
			"ts-nocheck": true,
			"ts-check": false,
			minimumDescriptionLength: 3
		}],
		"@typescript-eslint/ban-types": ["error", {
			types: {
				"Function": false
			},
		}],
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-for-in-array": "error",
		"@typescript-eslint/no-unused-vars": ["warn", {
			varsIgnorePattern: "^_",
			argsIgnorePattern: "^_",
			caughtErrorsIgnorePattern: "^_"
		}]
	}
};
