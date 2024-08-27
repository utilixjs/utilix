import { defineConfig, presetUno, transformerDirectives, type Rule } from 'unocss';
import { presetForms } from '@julr/unocss-preset-forms';

const formsPreset = presetForms({ strategy: 'class' });

if (formsPreset.rules) {
	const rulesMap = new Map<string, { rule?: Rule[1], pseudos?: Map<string, Rule[1]> }>();

	for (const rule of formsPreset.rules) {
		const orgName = (typeof rule[0] === 'string') ? rule[0] : rule[0].toString().slice(2, -2);
		const isPseudo = orgName.includes(':');
		const rName = isPseudo ? orgName.slice(0, orgName.indexOf(':')) : orgName;

		if (!rulesMap.has(rName)) {
			rulesMap.set(rName, {});
		}

		const r = rulesMap.get(rName)!;
		if (isPseudo) {
			r.pseudos ??= new Map();
			r.pseudos.set(orgName.slice(orgName.indexOf(':')), rule[1]);
		} else {
			r.rule = rule[1];
		}
	}

	const formsPresetRules: Rule[] = [];
	for (const [rName, { rule, pseudos }] of rulesMap) {
		formsPresetRules.push([new RegExp(`^${rName}$`), function* (match, ctx): any {
			if (rule) {
				yield typeof rule === 'function' ? rule(match, ctx) : rule;
			}

			if (pseudos) {
				for (const [pseudo, pRule] of pseudos) {
					const res = typeof pRule === 'function' ? pRule(match, ctx) : pRule;
					if (typeof res === 'object') {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
						(res as any)[ctx.symbols.selector] = (s: string) => `${s}${pseudo}`;
					}

					yield res;
				}
			}
		}]);
	}

	formsPreset.rules = formsPresetRules;
}

export default defineConfig({
	presets: [
		formsPreset,
		presetUno({ darkMode: 'class' })
	],
	transformers: [transformerDirectives()]
});
