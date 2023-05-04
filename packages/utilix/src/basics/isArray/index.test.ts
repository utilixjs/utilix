import { describe, it, expect } from 'vitest';
import { isArray } from './';

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
		expect(isArray(((function (..._: any[]) { return arguments; }).apply(null, [1, 2])))).toBeFalsy();
		expect(isArray(new Set())).toBeFalsy();
		expect(isArray(new Date())).toBeFalsy();
		expect(isArray(new Error())).toBeFalsy();
		expect(isArray(/x/)).toBeFalsy();
	});
});
