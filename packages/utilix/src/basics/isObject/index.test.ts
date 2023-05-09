import { describe, it, expect } from 'vitest';
import { isObject, isPlainObject } from './';

describe('isObject', () => {
	it('should return `true` for objects', () => {
		expect(isObject({ 'a': 1 })).toBeTruthy();
		expect(isObject([1, 2, 3])).toBeTruthy();
		expect(isObject(Object(1))).toBeTruthy();
		expect(isObject(new Set())).toBeTruthy();
		expect(isObject(new Date())).toBeTruthy();
		expect(isObject(new Error())).toBeTruthy();
		expect(isObject(/x/)).toBeTruthy();
	});

	it('should return `false` for non-objects', () => {
		expect(isObject(1)).toBeFalsy();
		expect(isObject('a')).toBeFalsy();
		expect(isObject(null)).toBeFalsy();
		expect(isObject(true)).toBeFalsy();
		expect(isObject(() => {})).toBeFalsy();
	});
});

describe('isPlainObject', () => {
	it('should return `true` for plain-object values', () => {
		expect(isPlainObject({ 'a': 1 })).toBeTruthy();
		expect(isPlainObject(new class { })).toBeTruthy();
	});

	it('should return `false` for non-plain-object values', () => {
		expect(isPlainObject([])).toBeFalsy();
		expect(isPlainObject([1, 2, 3])).toBeFalsy();
		expect(isPlainObject(null)).toBeFalsy();
		expect(isPlainObject(true)).toBeFalsy();
		expect(isPlainObject(new Set())).toBeFalsy();
		expect(isPlainObject(new Date())).toBeFalsy();
		expect(isPlainObject(new Error())).toBeFalsy();
		expect(isPlainObject(Object('a'))).toBeFalsy();
		expect(isPlainObject(/x/)).toBeFalsy();
	});
});
