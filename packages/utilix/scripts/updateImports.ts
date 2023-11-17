import fs from 'fs-extra';
import path from 'path';
import { mainModule, type UCategory } from './modules';
import { Mutable } from '../src/types';

const NLINE = '\r\n';

async function updateImport(ct: UCategory) {
	console.log('Generating imports for', ct.name);

	const imports = ct.modules
		.map(m => m.name)
		.sort()
		.map(name => `export * from './${name}';`);

	if (ct.name === mainModule.name) {
		imports.push(`export * from './types';`);
	}

	if (!ct.index) {
		(ct as Mutable<UCategory>).index = path.join(ct.dir, 'index.ts');
	}

	return fs.writeFile(ct.index, `${imports.join(NLINE)}${NLINE}`);
}

export async function updateImports() {
	await updateImport(mainModule);
	await Promise.all(mainModule.modules.map(c => updateImport(c)));
}
