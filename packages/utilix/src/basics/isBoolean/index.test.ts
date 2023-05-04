import { describe, it, expect, type Assertion } from 'vitest';
import { isBoolean, isBooleanObject } from './';

function primitiveCheck(func: (val: any) => boolean) {
	expect(func(true)).toBeTruthy();
	expect(func(false)).toBeTruthy();
	expect(func(Boolean(true))).toBeTruthy();
	expect(func(Boolean(false))).toBeTruthy();
}

function objectCheck(func: (val: any) => boolean, tobe: (assert: Assertion<boolean>) => void) {
	tobe(expect(func(Object(true))));
	tobe(expect(func(Object(false))));
	tobe(expect(func(new Boolean(true))));
	tobe(expect(func(new Boolean(false))));
}

function nonBoolCheck(func: (val: any) => boolean) {
	expect(func(1)).toBeFalsy();
	expect(func('true')).toBeFalsy();
	expect(func(null)).toBeFalsy();
	expect(func([1, 2, 3])).toBeFalsy();
	expect(func({ 'a': 1 })).toBeFalsy();
	expect(func(new Date())).toBeFalsy();
	expect(func(new Error())).toBeFalsy();
	expect(func(/x/)).toBeFalsy();
}

describe('isBoolean', () => {
	it('should return `true` for primitive booleans', () => {
		primitiveCheck(isBoolean);
	});

	it('should return `false` for object booleans', () => {
		objectCheck(isBoolean, (assert) => assert.toBeFalsy());
	});

	it('should return `false` for non-booleans', () => {
		nonBoolCheck(isBoolean);
	});
});

describe('isBooleanObject', () => {
	it('should return `true` for primitive booleans', () => {
		primitiveCheck(isBooleanObject);
	});

	it('should return `true` for object booleans', () => {
		objectCheck(isBooleanObject, (assert) => assert.toBeTruthy());
	});

	it('should return `false` for non-booleans', () => {
		nonBoolCheck(isBooleanObject);
	});
});