import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath, URL } from 'url';
import type { Awaitable, Mutable } from "../src/types";

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

async function mapModules<T>(dir: string, mapper: (moduleName: string, indexFile: string) => Awaitable<T>) {
	const modules: T[] = [];
	const dirs = await fs.readdir(dir, { withFileTypes: true });

	for (const m of dirs) {
		if (m.isDirectory() && !m.name.startsWith('.')) {
			const indexFile = path.join(dir, m.name, 'index.ts');
			if (fs.existsSync(indexFile)) {
				modules.push(await mapper(m.name, indexFile));
			}
		}
	}

	return modules;
}

export const modules: readonly UCategory[] = await mapModules<UCategory>(srcDir, async (cName, cIndex) => {
	const cDir = path.join(cIndex, '..');
	console.log('Category', cName, `(${cDir})`);

	const category: UCategory = {
		name: cName,
		index: cIndex,
		dir: cDir,
		modules: await mapModules<UModule>(cDir, async (mName, mIndex) => {
			const mDir = path.join(mIndex, '..');
			console.log('├─ Module', mName, `(${mDir})`);

			const module: Mutable<UModule> = {
				name: mName,
				index: mIndex,
				dir: mDir
			};

			const docFile = path.join(mDir, 'index.md');
			if (await fs.exists(docFile)) {
				module.doc = docFile;
			}

			return module;
		})
	};
	console.log();

	return category;
});

export const mainModule: UModule & {
	readonly modules: readonly UCategory[];
} = {
	name: 'MAIN',
	dir: srcDir,
	index: path.join(srcDir, 'index.ts'),
	modules: modules
};
