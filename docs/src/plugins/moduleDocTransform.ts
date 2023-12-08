import type { Plugin } from 'vite';
import * as um from './docExporter';

const NLINE = '\r\n';
const DNLINE = NLINE + NLINE;

export const UModulePathRegex = /packages\/utilix\/src\/(\w+\/\w+)\/index\.md$/;
export const DocTransformPluginName = 'utilix-ModuleDocTransform';
export interface DocTransformPluginAPI {
	transform(code: string, module: string, watchModule?: string): string;
}

export function moduleDocTransform(): Plugin<DocTransformPluginAPI> {
	let exporter: um.DocExporterPluginAPI;

	function transform(code: string, module: string, watchModule?: string) {
		const codeIndex = code.indexOf('## ');
		const md = mdExports(exporter.getExports(module, watchModule), module.slice(module.indexOf('/') + 1));

		return (codeIndex > 0)
			? code.slice(0, codeIndex) + md + code.slice(codeIndex)
			: code + NLINE + md;
	}

	return {
		name: DocTransformPluginName,
		enforce: 'pre',
		configResolved({ plugins }) {
			const exporterPlugin = plugins.find(plugin => plugin.name === um.DocExporterPluginName);
			if (!exporterPlugin) {
				throw new Error(`This plugin depends on the "${um.DocExporterPluginName}" plugin.`);
			}
			exporter = exporterPlugin.api as um.DocExporterPluginAPI;
		},

		transform(code, id) {
			const match = id.match(UModulePathRegex);
			if (match) {
				return transform(code, match[1], id);
			}
		},

		api: { transform }
	};
}

function mdExports(exps: um.UModuleExports, main: string) {
	let md = '';
	if (exps.has(main)) {
		md += mdExport(main, exps.get(main)!);
	}

	for (const [name, exp] of exps) {
		if (name === main) {
			continue;
		}

		md += mdExport(name, exp);
	}

	return md;
}

function mdExport(name: string, exp: um.UModuleExport) {
	let md = `## ${name} <span class="badge badge-outline badge-${exp.kind}">${exp.kind}</span>` + DNLINE;

	if (exp.kind === 'function') {
		md += mdSignatures(exp.overloads, `${exp.kind} ${exp.name}`);
	} else if (exp.kind === 'class') {
		md += mdClass(exp);
	}

	return md;
}

function mdClass(cls: um.UModuleClass) {
	let md = '';
	md += mdCode(codeInterfaceLike(cls)) + DNLINE + mdDoc(cls.doc, DNLINE);
	md += mdTypeParameter(cls.typeParameters);

	if (cls.constructors.length) {
		md += '### Constructors' + DNLINE;
		md += mdSignatures(cls.constructors, 'constructor', 4, false, false);
	}

	if (cls.properties.size || cls.staticMembers.properties.size) {
		md += '### Properties' + DNLINE;
		if (cls.properties.size) {
			md += mdProperties(cls.properties);
		}
		if (cls.staticMembers.properties.size) {
			md += mdProperties(cls.staticMembers.properties, !cls.properties.size, true);
		}
		md += NLINE;
	}

	if (cls.methods.size) {
		md += mdMethods(cls.methods);
		md += mdMethods(cls.staticMembers.methods, true);
	}

	return md;
}

function mdSignatures(fn: um.UModuleSignature[], name: string, hLevel = 3, returnType = true, typeParams = true) {
	let md = '';
	const hTags = '#'.repeat(hLevel) + ' ';

	for (const s of fn) {
		if (md.length) {
			md += '---' + DNLINE;
		}

		md += mdCode(name + codeSignature(s, returnType, typeParams)) + DNLINE + mdDoc(s.doc, DNLINE);
		if (typeParams) {
			md += mdTypeParameter(s.typeParameters);
		}

		if (s.parameters.length) {
			md += hTags + 'Parameters' + DNLINE;

			for (const param of s.parameters) {
				md += '- `' + codeParameter(param) + '`' + NLINE + mdDoc(param.doc);
			}
			md += NLINE;
		}

		if (returnType && s.returnType !== 'void') {
			md += hTags + 'Return `' + `${s.returnType}` + '`' + (s.returnDoc ? NLINE + s.returnDoc : '') + DNLINE;
		}
	}

	return md;
}

const STATIC_BADGE = '<span class="badge badge-outline badge-static">static</span>';

function mdProperties(props: um.UModuleTypeMembers['properties'], th = true, pStatic = false) {
	let md = th ?
		'| Name | Type | Description |' + NLINE +
		'| ---- | ---- | ----------- |' + NLINE : '';

	for (const [name, prop] of props) {
		md += `| ${name} ${pStatic ? STATIC_BADGE + ' ' : ''}`;
		if (prop.kind === 'accessor') {
			md += `| \`${prop.type}\` `;
			md += '| ' +
				(prop.get ? mdPropDoc(prop.get, 'get') : '') +
				(prop.set ? (prop.get ? '<br />' : '') + mdPropDoc(prop.set, 'set') : '') + ' |' + NLINE;
		} else {
			md += `| \`${prop.type}\` `;
			md += `| ${mdPropDoc(prop, 'field')} |` + NLINE;
		}
	}

	return md;
}

function mdMethods(methods: um.UModuleTypeMembers['methods'], pStatic = false) {
	let md = '';

	for (const [name, method] of methods) {
		const amBadge = mdAccessModifierBadge(method.accessModifier);
		md += `### ${name} ${pStatic ? STATIC_BADGE + ' ' : ''}<span class="badge badge-method">method</span>${amBadge ? ' ' + amBadge : ''}` + DNLINE;
		md += mdSignatures(method.overloads, method.name, 4);
	}
	return md;
}

function mdTypeParameter(params: um.UModuleTypeParameter[] | undefined, hLevel = 3) {
	let md = '';

	if (params?.length) {
		md += '#'.repeat(hLevel) + ' Type Parameters' + DNLINE;
		for (const param of params) {
			md += '- `' + codeTypeParameter(param) + '`' + NLINE + mdDoc(param.doc);
		}
		md += NLINE;
	}

	return md;
}

function mdPropDoc(prop: { doc: string; readonly?: boolean; optional?: boolean; accessModifier?: um.UModuleTypeMember['accessModifier'] }, kind: 'field' | 'get' | 'set') {
	const amBadge = mdAccessModifierBadge(prop.accessModifier);
	let md = `<span class="badge badge-${kind}">${kind}</span>${amBadge ? ' ' + amBadge : ''}`;

	if (prop.readonly) {
		md += ` <span class="badge badge-readonly">readonly</span>`;
	}
	if (prop.optional) {
		md += ` <span class="badge badge-optional">optional</span>`;
	}

	return md + (prop.doc ? ' ' + prop.doc.replace(/\r?\n/g, ' ') : '');
}

function mdAccessModifierBadge(accessModifier: um.UModuleTypeMember['accessModifier']) {
	return accessModifier && accessModifier !== 'public'
		? `<span class="badge badge-${accessModifier}">${accessModifier}</span>`
		: '';
}

function mdCode(code: string) {
	return '```ts' + NLINE + code + NLINE + '```';
}

function mdDoc(doc: string, line = NLINE) {
	return doc ? doc + line : '';
}

function codeInterfaceLike(cls: um.UModuleInterfaceLike) {
	return `${cls.kind} ${cls.name}${codeTypeParameters(cls.typeParameters)}`;
}

function codeSignature(call: um.UModuleSignature, returnType: boolean, typeParams = true) {
	return (typeParams ? codeTypeParameters(call.typeParameters) : '') + codeParameters(call.parameters) + (returnType ? `: ${call.returnType}` : '');
}

function codeParameters(params: um.UModuleParameter[]) {
	return params.length ? `(${params.map(codeParameter).join(', ')})` : '';
}

function codeTypeParameters(params?: um.UModuleTypeParameter[]) {
	return params?.length ? `<${params.map(codeTypeParameter).join(', ')}>` : '';
}

function codeParameter(p: um.UModuleParameter) {
	return `${p.name}${p.optional ? '?' : ''}: ${p.type}${codeParameterDefault(p)}`;
}

function codeTypeParameter(p: um.UModuleTypeParameter) {
	return `${p.name}${p.constraint ? ` extends ${p.constraint}` : ''}${codeParameterDefault(p)}`;
}

function codeParameterDefault(p: um.UModuleParameterLike) {
	return p.default ? ` = ${p.default}` : '';
}
