import { describe, it, expect } from 'vitest';
import { isArray, isArrayLike } from './';

// eslint-disable-next-line prefer-rest-params
const args = (function (..._: any[]) { return arguments; }).apply(null, [1, 2]);

describe('isArray', () => {
	it('should return `true` for arrays', () => {
		expect(isArray([])).toBeTruthy();
		expect(isArray([1, 2, 3])).toBeTruthy();
	});

	it('should return `false` for non-arrays', () => {
		expect(isArray(1)).toBeFalsy();
		expect(isArray('a')).toBeFalsy();
		expect(isArray(null)).toBeFalsy();
		expect(isArray(true)).toBeFalsy();
		expect(isArray({ '0': 1, 'length': 1 })).toBeFalsy();
		expect(isArray(args)).toBeFalsy();
		expect(isArray(new Set())).toBeFalsy();
		expect(isArray(new Date())).toBeFalsy();
		expect(isArray(new Error())).toBeFalsy();
		expect(isArray(/x/)).toBeFalsy();
	});
});

describe('isArrayLike', () => {
	it('should return `true` for array-like values', () => {
		expect(isArrayLike([])).toBeTruthy();
		expect(isArrayLike([1, 2, 3])).toBeTruthy();
		expect(isArrayLike(args)).toBeTruthy();
		expect(isArrayLike({ '0': 1, 'length': 1 })).toBeTruthy();
		expect(isArrayLike('a')).toBeTruthy();
	});

	it('should return `false` for non-array-like values', () => {
		expect(isArrayLike(1)).toBeFalsy();
		expect(isArrayLike(null)).toBeFalsy();
		expect(isArrayLike(true)).toBeFalsy();
		expect(isArrayLike({ 'a': 1 })).toBeFalsy();
		expect(isArrayLike(new Set())).toBeFalsy();
		expect(isArrayLike(new Date())).toBeFalsy();
		expect(isArrayLike(new Error())).toBeFalsy();
		expect(isArrayLike(/x/)).toBeFalsy();
	});
});
