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
		const md = mdExports(exporter.getExports(module, watchModule),  module.slice(module.indexOf('/') + 1));

		return (codeIndex > 0)
			? code.slice(0, codeIndex) + md +  code.slice(codeIndex)
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
			exporter = exporterPlugin.api;
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
	let md = `## ${name} <span class="badge badge-${exp.kind}">${exp.kind}</span>` + DNLINE;

	if (exp.kind === 'function') {
		md += mdFunction(exp);
	}

	return md;
}

function mdFunction(fn: um.UModuleFunction | um.UModuleMethod) {
	let md = '';
	for (const s of fn.overloads) {
		const sCode = (('kind' in fn) ? fn.kind + ' ' : '') + codeMethod(fn, s);
		md += (s.doc ? s.doc + DNLINE : '') + mdCode(sCode) + DNLINE;
		if (s.typeParameters?.length) {
			md += '### Type Parameters' + DNLINE;

			for (const param of s.typeParameters) {
				md += '- `' + codeTypeParameter(param) + '`' + NLINE
					+ (param.doc ? param.doc + NLINE : '');
			}
			md += NLINE;
		}

		if (s.parameters.length) {
			md += '### Parameters' + DNLINE;

			for (const param of s.parameters) {
				md += '- `' + codeParameter(param) + '`' + NLINE
					+ (param.doc ? param.doc + NLINE : '');
			}
			md += NLINE;
		}

		if (s.returnType !== 'void') {
			md += '### Return `' + `${s.returnType}` + '`' + (s.returnDoc ? NLINE + s.returnDoc : '') + DNLINE;
		}
	}

	return md;
}

function mdCode(code: string) {
	return '```ts' + NLINE + code + NLINE + '```';
}

function codeMethod(fn: um.UModuleMethod, call: um.UModuleSignature) {
	return fn.name + codeSignature(call);
}

function codeSignature(call: um.UModuleSignature) {
	return codeTypeParameters(call.typeParameters) + codeParameters(call.parameters) + `: ${call.returnType}`;
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
	return `${p.name}${p.constraint ? ` extends ${p.constraint}` : ''}: ${p.type}${codeParameterDefault(p)}`;
}

function codeParameterDefault(p: um.UModuleParameterLike) {
	return p.default ? ` = ${p.default}` : '';
}
