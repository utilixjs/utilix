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
		vi.advanceTimersByTime(10000);
		expect(timer.time).toBe(2000);

		timer.resume();
		vi.advanceTimersByTime(3008);
		expect(timer.time).toBe(5000);

		timer.stop();
		expect(timer.time).toBe(0);
	});

	it('should start manually', () => {
		const timer = new Elapse({ interval: { delay: 100, immediate: false } });

		vi.advanceTimersByTime(10000);
		expect(timer.time).toBe(0);

		timer.start();
		vi.advanceTimersByTime(1010);
		expect(timer.time).toBe(1000);

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

	it('should disable the drift adjustment behavior', () => {
		const timer = new Elapse({ interval: 1000, driftAdjust: false });

		vi.advanceTimersByTime(1027);
		expect(timer.time).toBe(1027);

		timer.pause();
		vi.advanceTimersByTime(10000);
		expect(timer.time).toBe(1027);

		timer.resume();
		vi.advanceTimersByTime(5142);
		expect(timer.time).toBe(6169);

		timer.stop();
		expect(timer.time).toBe(0);
	});

	it('should evaluate timer state correctly', () => {
		const timer = new Elapse({ interval: { delay: 100, immediate: false } });

		expect(timer.state).toBe('inactive');

		timer.start();
		vi.advanceTimersByTime(100);
		expect(timer.state).toBe('active');

		timer.pause();
		expect(timer.state).toBe('paused');

		timer.resume();
		vi.advanceTimersByTime(100);
		expect(timer.state).toBe('active');

		timer.stop();
		expect(timer.state).toBe('inactive');
	});
});
