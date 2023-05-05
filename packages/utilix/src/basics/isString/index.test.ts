import { describe, it, expect, type Assertion } from 'vitest';
import { isString, isStringObject } from './';

function primitiveCheck(func: (val: any) => boolean) {
	expect(func('')).toBeTruthy();
	expect(func('a')).toBeTruthy();
	expect(func(String('123'))).toBeTruthy();
}

function objectCheck(func: (val: any) => boolean, tobe: (assert: Assertion<boolean>) => void) {
	tobe(expect(func(Object('0'))));
	tobe(expect(func(new String(false))));
}

function nonStrCheck(func: (val: any) => boolean) {
	expect(func(1)).toBeFalsy();
	expect(func(null)).toBeFalsy();
	expect(func(true)).toBeFalsy();
	expect(func([1, 2, 3])).toBeFalsy();
	expect(func({ '0': 1, 'length': 1 })).toBeFalsy();
	expect(func(Symbol())).toBeFalsy();
	expect(func(new Date())).toBeFalsy();
	expect(func(new Error())).toBeFalsy();
	expect(func(Symbol())).toBeFalsy();
	expect(func(/x/)).toBeFalsy();
}

describe('isString', () => {
	it('should return `true` for primitive strings', () => {
		primitiveCheck(isString);
	});

	it('should return `false` for object strings', () => {
		objectCheck(isString, (assert) => assert.toBeFalsy());
	});

	it('should return `false` for non-strings', () => {
		nonStrCheck(isString);
	});
});

describe('isStringObject', () => {
	it('should return `true` for primitive strings', () => {
		primitiveCheck(isStringObject);
	});

	it('should return `true` for object strings', () => {
		objectCheck(isStringObject, (assert) => assert.toBeTruthy());
	});

	it('should return `false` for non-strings', () => {
		nonStrCheck(isStringObject);
	});
});
