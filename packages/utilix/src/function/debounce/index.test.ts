import { debounce } from './';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('debounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should debounce a function', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 32);

		debounced();
		debounced();
		expect(callback).not.toBeCalled();
		vi.advanceTimersByTime(128);
		expect(callback).toBeCalledTimes(1);

		debounced();
		debounced();
		vi.advanceTimersByTime(128);
		expect(callback).toBeCalledTimes(2);
	});

	it('should return the last `func` result on subsequent debounced calls', () => {
		const debounced = debounce((v: string) => v, 32);

		expect(debounced('1')).toBe(undefined);
		expect(debounced('2')).toBe(undefined);

		vi.advanceTimersByTime(64);
		expect(debounced('3')).toBe('2');
	});

	it('should not immediately call `func` when `wait` is `0`', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 0);

		debounced();
		debounced();
		expect(callback).not.toBeCalled();

		vi.advanceTimersByTime(5);
		expect(callback).toBeCalled();
	});

	it('should call `func` at the start of the timer when `leading` is `true`', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, { timeout: 32, leading: true });

		debounced();
		expect(callback).toBeCalledTimes(1);

		debounced();
		debounced();
		expect(callback).toBeCalledTimes(1);

		vi.advanceTimersByTime(64);
		expect(callback).toBeCalledTimes(2);
	});

	it('should not call `func` at the end of the timer when `trailing` is `false`', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, { timeout: 32, trailing: false });

		debounced();
		debounced();
		expect(callback).not.toBeCalled();

		vi.advanceTimersByTime(64);
		expect(callback).not.toBeCalled();
	});

	it('should call `func` when the timer reaches `maxWait` value', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, { timeout: 32, maxWait: 64 });

		debounced();
		debounced();
		expect(callback).not.toBeCalled();
		vi.advanceTimersByTime(24);
		expect(callback).not.toBeCalled();
		debounced();
		vi.advanceTimersByTime(24);
		expect(callback).not.toBeCalled();
		debounced();
		vi.advanceTimersByTime(24);
		expect(callback).toBeCalled();
	});

	it('should queue a trailing call for subsequent debounced calls after `maxWait`', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, { timeout: 32, maxWait: 32 });

		debounced();
		setTimeout(debounced, 20);
		setTimeout(debounced, 40);
		setTimeout(debounced, 60);
		vi.advanceTimersByTime(100);
		expect(callback).toBeCalledTimes(2);
	});
});
