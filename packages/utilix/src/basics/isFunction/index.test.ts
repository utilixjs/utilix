import { describe, it, expect } from 'vitest';
import { isFunction } from './';

describe('isFunction', () => {
	it('should return `true` for functions', () => {
		expect(isFunction(() => {})).toBeTruthy();
		expect(isFunction(isFunction)).toBeTruthy();
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(isFunction("".slice)).toBeTruthy();
	});

	it('should return `true` for async functions', () => {
		expect(isFunction(async () => {})).toBeTruthy();
	});

	it('should return `true` for generator functions', () => {
		expect(isFunction(function* () {})).toBeTruthy();
	});

	it('should return `true` for constructors', () => {
		expect(isFunction(Set)).toBeTruthy();
		expect(isFunction(Proxy)).toBeTruthy();
		expect(isFunction(class {})).toBeTruthy();
	});

	it('should return `false` for non-functions', () => {
		expect(isFunction(1)).toBeFalsy();
		expect(isFunction('a')).toBeFalsy();
		expect(isFunction(null)).toBeFalsy();
		expect(isFunction(true)).toBeFalsy();
		expect(isFunction([1, 2, 3])).toBeFalsy();
		expect(isFunction({ 'a': 1 })).toBeFalsy();
		expect(isFunction(new Set())).toBeFalsy();
		expect(isFunction(new Date())).toBeFalsy();
		expect(isFunction(new Error())).toBeFalsy();
		expect(isFunction(Symbol())).toBeFalsy();
		expect(isFunction(/x/)).toBeFalsy();
	});
});
