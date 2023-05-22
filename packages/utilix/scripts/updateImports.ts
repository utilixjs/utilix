import fs from 'fs-extra';
import { mainModule, type UCategory } from './modules';

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

	return fs.writeFile(ct.index, `${imports.join(NLINE)}${NLINE}`)
}

export async function updateImports() {
	await updateImport(mainModule);
	await Promise.all(mainModule.modules.map(c => updateImport(c)));
}
