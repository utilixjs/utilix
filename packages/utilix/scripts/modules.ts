import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath, URL } from 'url';

export interface UModule {
	readonly name: string;
	readonly dir: string;
	readonly index: string;
}

export interface UCategory extends UModule {
	readonly modules: readonly UModule[];
}

export const srcDir = fileURLToPath(new URL('../src', import.meta.url));
console.log(srcDir);

function mapModules<T>(dir: string, mapper: (c: T, m: string, d: string) => void, cls: T) {
	return fs.readdirSync(dir, { withFileTypes: true }).reduce((c, m) => {
		if (m.isDirectory() && !m.name.startsWith('.')) {
			const sdir = path.join(dir, m.name, 'index.ts');
			if (fs.existsSync(sdir)) {
				mapper(c, m.name, sdir);
			}
		}

		return c;
	}, cls);
}

export const modules: readonly UCategory[] = mapModules<UCategory[]>(srcDir, (ctrgs, cname, cindex) => {
	const cdir = path.join(cindex, '../');
	console.log('Category', cname, `(${cdir})`);

	ctrgs.push({
		name: cname,
		index: cindex,
		dir: cdir,
		modules: mapModules<UModule[]>(cdir, (mdls, mname, mindex) => {
			const mdir = path.join(mindex, '../');
			console.log('|- Module', mname, `(${mdir})`);

			mdls.push({
				name: mname,
				index: mindex,
				dir: mdir
			})
		}, [])
	});
	console.log();
}, []);

export const mainModule: UModule & {
	readonly modules: readonly UCategory[];
} = {
	name: 'MAIN',
	dir: srcDir,
	index: path.join(srcDir, 'index.ts'),
	modules: modules
};
