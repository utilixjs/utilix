import { describe, it, expect } from 'vitest';
import { isNumber, isNumberObject, isNumeric } from './';

const Num = [0, 123, 0xff, -5e3, Number('0.2'), Math.PI];
const NumObj = [Object(0), Object(-45), new Number(NaN), new Number(0.2)];
const NumNonFinite = [NaN, Infinity, -Infinity];
const NumStr = ['0', '-0.1', '012', '0xff', '5e3', '  56\r\n '];
const NonNum = ['x', null, true, [1, 2, 3], { 'a': 1 }, Symbol(), new Date(), new Error(), /x/];

function expectAll(values: any[], checker: (val: any) => boolean, truthy: boolean) {
	values.forEach(val => {
		const assert = expect(checker(val));
		truthy ? assert.toBeTruthy(): assert.toBeFalsy();
	});
}

describe('isNumber', () => {
	it('should return `true` for primitive numbers', () => {
		expectAll(Num, isNumber, true);
	});

	it('should return `true` for non-finite numbers', () => {
		expectAll(NumNonFinite, isNumber, true);
	});

	it('should return `false` for object numbers', () => {
		expectAll(NumObj, isNumber, false);
	});

	it('should return `false` for string numbers', () => {
		expectAll(NumStr, isNumber, false);
	});

	it('should return `false` for non-numbers', () => {
		expectAll(NonNum, isNumber, false);
	});
});

describe('isNumberObject', () => {
	it('should return `true` for primitive numbers', () => {
		expectAll(Num, isNumberObject, true);
	});

	it('should return `true` for non-finite numbers', () => {
		expectAll(NumNonFinite, isNumberObject, true);
	});

	it('should return `true` for object numbers', () => {
		expectAll(NumObj, isNumberObject, true);
	});

	it('should return `false` for string numbers', () => {
		expectAll(NumStr, isNumberObject, false);
	});

	it('should return `false` for non-numbers', () => {
		expectAll(NonNum, isNumberObject, false);
	});
});

describe('isNumeric', () => {
	it('should return `true` for primitive numbers', () => {
		expectAll(Num, isNumeric, true);
	});

	it('should return `false` for non-finite numbers', () => {
		expectAll(NumNonFinite, isNumeric, false);
	});

	it('should return `false` for object numbers', () => {
		expectAll(NumObj, isNumeric, false);
	});

	it('should return `true` for string numbers', () => {
		expectAll(NumStr, isNumeric, true);
	});

	it('should return `false` for non-numbers', () => {
		expectAll(NonNum, isNumeric, false);
	});
});
