import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import tsutils from 'tsutils';
import { srcDir, rootDir } from './modules';

export interface UModuleNode {
	name: string;
	type: string;
	doc: string;
}

export type UModuleExport = UModuleClass | UModuleInterface | UModuleFunction | UModuleTypeAlias;
export type UModuleExports = Map<string, UModuleExport>;

export type UModuleParameterLike = UModuleNode & { default?: string; };
export type UModuleParameter = UModuleParameterLike & { optional: boolean; };
export type UModuleTypeParameter = UModuleParameterLike & { constraint?: string; };
export type UModuleGenericable = { typeParameters?: UModuleTypeParameter[]; }
export type UModuleClassMember = { accessModifier: 'public' | 'protected' | 'private'; }

export interface UModuleSignature extends Pick<UModuleNode, 'doc'>, UModuleGenericable {
	parameters: UModuleParameter[];
	returnType: string;
	returnDoc: string;
}

interface UModuleField extends UModuleNode {
	kind: 'field';
	readonly: boolean;
	optional: boolean;
}

export interface UModulePropertyAccessor {
	kind: 'accessor';
	get?: UModuleNode;
	set?: UModuleNode;
}

export type UModuleProperty = UModuleField | UModulePropertyAccessor;

export interface UModuleMethod extends UModuleNode {
	overloads: UModuleSignature[];
}

export interface UModuleTypeMembers<TProp extends UModuleProperty = UModuleProperty,
	TMethod extends UModuleMethod = UModuleMethod> {
	properties: Map<string, TProp>;
	methods: Map<string, TMethod>;
}

export interface UModuleInterfaceLike<
	TKind extends 'class' | 'interface' = 'class' | 'interface',
	TProp extends UModuleProperty = UModuleProperty,
	TMethod extends UModuleMethod = UModuleMethod> extends UModuleNode, UModuleTypeMembers<TProp, TMethod>, UModuleGenericable {
	kind: TKind;
	baseTypes?: string[];
}

export interface UModuleClass extends UModuleInterfaceLike<'class', UModuleProperty & UModuleClassMember, UModuleMethod & UModuleClassMember> {
	constructors: UModuleSignature[];
	staticMembers: UModuleTypeMembers<UModuleProperty & UModuleClassMember, UModuleMethod & UModuleClassMember>;
}

export type UModuleInterface = UModuleInterfaceLike<'interface'>;

export interface UModuleTypeAlias extends UModuleNode, UModuleGenericable {
	kind: 'type';
}

export interface UModuleFunction extends UModuleNode, UModuleMethod {
	kind: 'function';
}

function tsFormatDiagnostics(diagnostics: ts.Diagnostic[]) {
	return ts.formatDiagnostics(diagnostics, {
		getCanonicalFileName: f => f,
		getCurrentDirectory: () => process.cwd(),
		getNewLine: () => '\n',
	});
}

function createProgramFromConfigFile(configFile: string, projectDirectory: string, watchCallback?: () => void) {
	if (ts.sys === undefined) {
		throw new Error('`createProgramFromConfigFile` is only supported in a Node-like environment.');
	}

	projectDirectory = (projectDirectory && path.resolve(projectDirectory)) || process.cwd();
	const parsed = ts.getParsedCommandLineOfConfigFile(path.resolve(projectDirectory, configFile), { noEmit: true }, {
		onUnRecoverableConfigFileDiagnostic: diag => {
			throw new Error(tsFormatDiagnostics([diag]));
		},
		fileExists: fs.existsSync,
		getCurrentDirectory: () => projectDirectory,
		// eslint-disable-next-line @typescript-eslint/unbound-method
		readDirectory: ts.sys.readDirectory,
		readFile: file => fs.readFileSync(file, 'utf-8'),
		useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
	});
	const result = parsed;
	if (!result || result.errors.length) {
		if (result)
			throw new Error(tsFormatDiagnostics(result.errors));
	}

	if (watchCallback) {
		const host = ts.createWatchCompilerHost(result!.fileNames, result!.options, ts.sys);

		const wProg = ts.createWatchProgram(host);
		let prog = wProg.getProgram().getProgram();

		// eslint-disable-next-line @typescript-eslint/unbound-method
		const origPostProgramCreate = host.afterProgramCreate;
		host.afterProgramCreate = (p) => {
			prog = p.getProgram();
			origPostProgramCreate?.(p);
			watchCallback();
		};

		return { getProgram() { return prog; }, close() { wProg.close(); } };
	} else {
		const host = ts.createCompilerHost(result!.options, true);
		const prog = ts.createProgram(result!.fileNames, result!.options, host);
		return { getProgram() { return prog; } };
	}
}

export class UDocExporter {
	private readonly prog: { getProgram(): ts.Program; close?: () => void; };
	private readonly watchModules?: Map<string, { version: string; callback: () => void; }>;

	private get program() {
		return this.prog.getProgram();
	}
	private get checker() {
		return this.program.getTypeChecker();
	}

	constructor(watch = false) {
		this.prog = createProgramFromConfigFile('tsconfig.json', rootDir, watch ? (() => this.watchCallback()) : undefined);
		if (watch) {
			this.watchModules = new Map();
		}
	}

	getExports(file: string, watchCallback?: () => void) {
		const srcPath = path.join(srcDir, file);
		const srcFile = this.program.getSourceFile(srcPath);
		if (!srcFile) {
			console.warn('src not found', srcPath);
			return;
		}

		const srcSymbol = this.checker.getSymbolAtLocation(srcFile);
		const exports = new Map<string, UModuleExport>();
		//const exports: UModuleExports = {};

		srcSymbol?.exports?.forEach((expSymbol, expKey) => {
			const declaration = expSymbol.valueDeclaration ?? expSymbol.declarations?.[0];
			if (!declaration) {
				console.warn('declaration not found for', expKey);
				return;
			}

			exports.set(expKey.toString(), this.serializeExport(expSymbol, declaration));
			//exports[expKey.toString()] = this.serializeExport(expSymbol, declaration);
		});

		if (watchCallback && this.watchModules) {
			this.watchModules.set(srcFile.fileName, {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				version: (srcFile as any).version,
				callback: watchCallback
			});
		}

		return exports;
	}

	close() {
		this.prog.close?.();
	}

	private serializeExport(symbol: ts.Symbol, declaration: ts.Declaration) {
		const exp = this.serializeSymbol(symbol) as UModuleExport;

		if (ts.isClassDeclaration(declaration)) {
			exp.kind = 'class';
			this.serializeInterfaceLike(symbol, exp as UModuleInterfaceLike);
		} else if (ts.isFunctionDeclaration(declaration)) {
			exp.kind = 'function';
			this.serializeMethodFromSymbol(symbol, exp as UModuleFunction);
		} else if (ts.isInterfaceDeclaration(declaration)) {
			exp.kind = 'interface';
			this.serializeInterfaceLike(symbol, exp as UModuleInterfaceLike);
		} else if (ts.isTypeAliasDeclaration(declaration)) {
			exp.kind = 'type';
			this.serializeTypeAlias(symbol, exp as UModuleTypeAlias);
		}

		return exp;
	}

	private serializeInterfaceLike(symbol: ts.Symbol, exp: UModuleInterfaceLike) {
		const type = this.checker.getDeclaredTypeOfSymbol(symbol);
		if (!type.isClassOrInterface()) {
			console.warn('isClassOrInterface false for', symbol.getName());
			return;
		}

		exp.typeParameters = type.typeParameters?.map(p => this.serializeTypeParameter(p));
		exp.baseTypes = type.getBaseTypes()?.map(baseType => this.checker.typeToString(baseType));

		if (type.isClass()) {
			const classType = this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
			const expClass = exp as UModuleClass;

			expClass.constructors = classType.getConstructSignatures().map(c => this.serializeSignature(c));
			expClass.staticMembers = {} as UModuleClass['staticMembers'];
			this.serializeTypeMembers(classType, expClass.staticMembers);
		}

		this.serializeTypeMembers(type, exp);
	}

	private serializeTypeAlias(symbol: ts.Symbol, exp: UModuleTypeAlias) {
		const typeDeclaration = symbol.declarations![0] as ts.TypeAliasDeclaration;
		exp.type = typeDeclaration.type.getText();
		exp.typeParameters = typeDeclaration.typeParameters?.map(p => this.serializeTypeParameterDeclaration(p));
	}

	private serializeTypeMembers(type: ts.Type, members: Partial<UModuleTypeMembers>) {
		members.properties = new Map();
		members.methods = new Map();
		//members.properties = {};
		//members.methods = {};

		for (const mSymbol of type.getProperties()) {
			if (!mSymbol.valueDeclaration) {
				continue;
			}

			const declaration = mSymbol.valueDeclaration;
			const mNode = this.serializeSymbol(mSymbol);

			if (type.isClass()) {
				(mNode as UModuleClassMember & UModuleNode).accessModifier = tsutils.isModifierFlagSet(declaration, ts.ModifierFlags.Private) ? 'private'
					: tsutils.isModifierFlagSet(declaration, ts.ModifierFlags.Protected) ? 'protected' : 'public';
			}

			if (ts.isPropertyDeclaration(declaration) || ts.isPropertySignature(declaration)) {
				const prop = mNode as UModuleField;
				prop.kind = 'field';
				prop.readonly = tsutils.isModifierFlagSet(declaration, ts.ModifierFlags.Readonly);
				prop.optional = !!declaration.questionToken;

				members.properties.set(mNode.name, prop);
				//members.properties[mNode.name] = prop;
			} else if (ts.isAccessor(declaration)) {
				let prop: UModuleProperty;
				if (members.properties.has(mNode.name)) {
					//if (members.properties[mNode.name]) {
					prop = members.properties.get(mNode.name)!;
					//prop = members.properties[mNode.name];
					if (prop.kind !== 'accessor') {
						continue;
					}
				} else {
					prop = { kind: 'accessor' };
					members.properties.set(mNode.name, prop);
					//members.properties[mNode.name] = prop;
				}

				prop[declaration.kind === ts.SyntaxKind.SetAccessor ? 'set' : 'get'] = mNode;
			} else if (ts.isMethodDeclaration(declaration) || ts.isMethodSignature(declaration)) {
				//if (members.methods[mNode.name]) {
				if (members.methods.has(mNode.name)) {
					continue;
				}

				members.methods.set(mNode.name, this.serializeMethodFromSymbol(mSymbol, mNode as UModuleMethod, declaration));
				//members.methods[mNode.name] = this.serializeMethodFromSymbol(mSymbol, mNode as UModuleMethod, declaration);
			}
		}
	}

	private serializeMethodFromSymbol(symbol: ts.Symbol, method: UModuleMethod, declaration = symbol.valueDeclaration!) {
		return this.serializeMethod(this.checker.getTypeOfSymbolAtLocation(symbol, declaration), method);
	}

	private serializeMethod(type: ts.Type, method: UModuleMethod) {
		method.overloads = type.getCallSignatures().map(c => this.serializeSignature(c));
		return method;
	}

	private serializeSignature(signature: ts.Signature): UModuleSignature {
		return {
			parameters: signature.parameters.map(pSymbol => {
				const param = this.serializeSymbol(pSymbol) as UModuleParameter;
				const declaration = pSymbol.valueDeclaration as ts.ParameterDeclaration;

				param.optional = !!declaration.questionToken;
				param.default = declaration.initializer?.getText();

				return param;
			}),
			typeParameters: signature.typeParameters?.map(p => this.serializeTypeParameter(p)),
			returnType: this.checker.typeToString(signature.getReturnType()),
			returnDoc: ts.displayPartsToString(signature.getJsDocTags().find(t => t.name === 'returns')?.text),
			doc: ts.displayPartsToString(signature.getDocumentationComment(this.checker))
		};
	}

	private serializeTypeParameter(typeParam: ts.TypeParameter) {
		const param = this.serializeSymbol(typeParam.symbol) as UModuleTypeParameter;
		const constraint = typeParam.getConstraint();
		const defaultType = typeParam.getDefault();

		if (constraint) {
			param.constraint = this.checker.typeToString(constraint);
		}

		if (defaultType) {
			param.default = this.checker.typeToString(defaultType);
		}

		return param;
	}

	private serializeTypeParameterDeclaration(typeParam: ts.TypeParameterDeclaration) {
		const symbol = this.checker.getSymbolAtLocation(typeParam.name)!;
		const param = this.serializeSymbol(symbol) as UModuleTypeParameter;
		const constraint = typeParam.constraint && this.checker.getTypeFromTypeNode(typeParam.constraint);
		const defaultType = typeParam.default && this.checker.getTypeFromTypeNode(typeParam.default);

		if (constraint) {
			param.constraint = this.checker.typeToString(constraint);
		}

		if (defaultType) {
			param.default = this.checker.typeToString(defaultType);
		}

		return param;
	}

	private serializeSymbol(symbol: ts.Symbol): UModuleNode {
		return {
			name: symbol.getName(),
			doc: ts.displayPartsToString(symbol.getDocumentationComment(this.checker)),
			type: this.checker.typeToString(this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!))
		};
	}

	private watchCallback() {
		if (this.watchModules) {
			this.watchModules.forEach((val, srcName) => {
				const srcFile = this.program.getSourceFile(srcName);
				if (!srcFile) {
					return;
				}

				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const currVersion: string = (srcFile as any).version;

				if (val.version !== currVersion) {
					val.version = currVersion;
					val.callback();
				}
			});
		}
	}
}
