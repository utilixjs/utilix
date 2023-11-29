import path from 'path';
import type { Plugin, ViteDevServer } from 'vite';
import { UDocExporter, type UModuleExports } from '../../../packages/utilix/scripts/UDocExporter';

class DocExporter {
	private readonly base: UDocExporter;
	private readonly exports = new Map<string, { exports: UModuleExports, watchModules?: Set<string> }>;

	constructor(private readonly server?: ViteDevServer) {
		this.base = new UDocExporter(!!server);
	}

	getExports(module: string, watchModule?: string) {
		if (!this.exports.has(module)) {
			const exp = this.base.getExports(path.join(module, 'index.ts'), () => {
				this.updateModule(module);
			});
			if (exp) {
				this.exports.set(module, { exports: exp });
			}
		}

		const exp = this.exports.get(module)!;
		if (this.server && watchModule) {
			exp.watchModules ??= new Set();
			exp.watchModules.add(watchModule);
		}
		return exp.exports;
	}

	close() {
		this.base.close();
	}

	private updateModule(module: string) {
		if (!this.exports.has(module)) {
			return;
		}

		const exp = this.exports.get(module)!;
		exp.exports = this.base.getExports(path.join(module, 'index.ts'))!;
		const server = this.server;

		if (server && exp.watchModules) {
			exp.watchModules.forEach(moduleId => {
				const moduleNode = server.moduleGraph.getModuleById(moduleId);
				if (moduleNode) {
					server.moduleGraph.onFileChange(moduleNode.file!);
					if (server.ws) {
						server.ws.send({
							type: 'update',
							updates: [{
								type: `${moduleNode.type}-update`,
								timestamp: Date.now(),
								explicitImportRequired: true,
								path: moduleNode.url,
								acceptedPath: moduleNode.url
							}]
						});
					}
				}
			});
		}
	}
}

export const DocExporterPluginName = 'utilix-DocExporter';
export interface DocExporterPluginAPI {
	getExports(module: string, watchModule?: string): UModuleExports;
}

export function docExporter(): Plugin<DocExporterPluginAPI> {
	let exporter: DocExporter;

	return {
		name: DocExporterPluginName,
		enforce: 'pre',

		configResolved(resolvedConfig) {
			if (resolvedConfig.command !== 'serve') {
				exporter = new DocExporter();
			}
		},
		configureServer(server) {
			exporter = new DocExporter(server);
		},
		buildEnd() {
			exporter.close();
		},
		api: {
			getExports(module, watchModule) {
				return exporter.getExports(module, watchModule);
			}
		}
	}
}

export * from '../../../packages/utilix/scripts/UDocExporter';
