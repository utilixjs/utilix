import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath, URL } from 'url';
import type { Awaitable, Mutable } from "utilix/types";

export interface UModule {
	readonly name: string;
	readonly dir: string;
	readonly index: string;
	readonly doc?: string;
}

export interface UCategory extends UModule {
	readonly modules: readonly UModule[];
}

export const rootDir = fileURLToPath(new URL('../', import.meta.url));
export const srcDir = path.join(rootDir, 'src/');

console.log('root:', rootDir);
console.log('src:', srcDir);

async function mapModules<T>(dir: string, mapper: (module: Mutable<UModule>, i: number, l: number) => Awaitable<T | void>) {
	const modules: T[] = [];
	const dirs = (await fs.readdir(dir, { withFileTypes: true }))
		.filter(d => d.isDirectory() && !(d.name.startsWith('.') || d.name.startsWith('_')));

	for (let i = 0, l = dirs.length; i < l; i++) {
		const m = dirs[i];
		const mDir = path.join(dir, m.name);
		const indexFile = path.join(mDir, 'index.ts');
		const docFile = path.join(mDir, 'index.md');
		const module = await mapper({
			name: m.name,
			dir: mDir,
			index: (await fs.exists(indexFile)) ? indexFile : '',
			doc: (await fs.exists(docFile)) ? docFile : undefined,
		}, i, l);
		if (module)
			modules.push(module);
	}

	return modules;
}

export const modules: readonly UCategory[] = await mapModules<UCategory>(srcDir, async (c) => {
	console.group('Category', c.name, `(${c.dir})`);

	const cModules = await mapModules<UModule>(c.dir, (module, i, l) => {
		const srcExists = !!module.index;
		console.log(`${(i === l - 1) ? '└' : '├'}─`, 'Module', module.name, srcExists ? `(${module.dir})${module.doc ? ' 📖' : ''}` : "\x1b[33m[Src index not found!]\x1b[0m");

		if (srcExists) {
			return module;
		}
	});

	if (!cModules.length) {
		console.log(`\x1b[33mNo module found in [${c.name}] category\x1b[0m`);
	}
	console.groupEnd();

	if (cModules.length) {
		const category = c as Mutable<UCategory>;
		category.modules = cModules;
		return category;
	}
});

export const mainModule: UModule & {
	readonly modules: readonly UCategory[];
} = {
	name: 'MAIN',
	dir: srcDir,
	index: path.join(srcDir, 'index.ts'),
	modules: modules
};
