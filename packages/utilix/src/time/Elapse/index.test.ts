import { Elapse } from './';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Elapse', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should calculate elapsed time correctly', () => {
		const timer = new Elapse({ interval: 1000 });

		vi.advanceTimersByTime(2010);
		expect(timer.time).toBe(2000);

		timer.pause();
		vi.advanceTimersByTime(2011);
		expect(timer.time).toBe(2000);

		timer.resume();
		vi.advanceTimersByTime(3008);
		expect(timer.time).toBe(5000);

		timer.stop();
		expect(timer.time).toBe(0);
	});

	it('should execute callback after each tick', () => {
		const callback = vi.fn((_: number) => { });
		const timer = new Elapse({ interval: 50, onTick: callback });

		vi.advanceTimersToNextTimer();
		expect(callback).toBeCalledTimes(1);
		expect(callback).toBeCalledWith(50);

		vi.advanceTimersByTime(150);
		expect(callback).toBeCalledTimes(4);
		expect(callback).toBeCalledWith(200);

		timer.pause();
		vi.advanceTimersByTime(5000);
		expect(callback).toBeCalledTimes(4);

		timer.resume();
		vi.advanceTimersByTime(100);
		expect(callback).toBeCalledTimes(6);
		expect(callback).toBeCalledWith(300);

		timer.stop();
	});
});
