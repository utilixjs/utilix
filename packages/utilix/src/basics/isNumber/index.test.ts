import { describe, it, expect, type Assertion } from 'vitest';
import { isNumber, isNumberObject } from './';

function primitiveCheck(func: (val: any) => boolean) {
	expect(func(0)).toBeTruthy();
	expect(func(123)).toBeTruthy();
	expect(func(NaN)).toBeTruthy();
	expect(func(Infinity)).toBeTruthy();
	expect(func(Number(0.2))).toBeTruthy();
	expect(func(Number(Math.PI))).toBeTruthy();
}

function objectCheck(func: (val: any) => boolean, tobe: (assert: Assertion<boolean>) => void) {
	tobe(expect(func(Object(0))));
	tobe(expect(func(Object(45))));
	tobe(expect(func(new Number(NaN))));
	tobe(expect(func(new Number(false))));
}

function nonNumCheck(func: (val: any) => boolean) {
	expect(func('x')).toBeFalsy();
	expect(func(null)).toBeFalsy();
	expect(func(true)).toBeFalsy();
	expect(func([1, 2, 3])).toBeFalsy();
	expect(func({ 'a': 1 })).toBeFalsy();
	expect(func(Symbol())).toBeFalsy();
	expect(func(new Date())).toBeFalsy();
	expect(func(new Error())).toBeFalsy();
	expect(func(/x/)).toBeFalsy();
}

describe('isNumber', () => {
	it('should return `true` for primitive numbers', () => {
		primitiveCheck(isNumber);
	});

	it('should return `false` for object numbers', () => {
		objectCheck(isNumber, (assert) => assert.toBeFalsy());
	});

	it('should return `false` for non-numbers', () => {
		nonNumCheck(isNumber);
	});
});

describe('isNumberObject', () => {
	it('should return `true` for primitive numbers', () => {
		primitiveCheck(isNumberObject);
	});

	it('should return `true` for object numbers', () => {
		objectCheck(isNumberObject, (assert) => assert.toBeTruthy());
	});

	it('should return `false` for non-numbers', () => {
		nonNumCheck(isNumberObject);
	});
});
