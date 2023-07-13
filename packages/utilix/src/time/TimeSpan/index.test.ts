import { describe, it, expect } from 'vitest';
import { TimeSpan } from './';

describe('TimeSpan', () => {
	it('should calculate total values', () => {
		const ts = new TimeSpan(3661000);
		expect(ts.totalMilliseconds).toBe(3661000);
		expect(ts.totalSeconds).toBeCloseTo(3661);
		expect(ts.totalMinutes).toBeCloseTo(61.0167);
		expect(ts.totalHours).toBeCloseTo(1.01694);
		expect(ts.totalDays).toBeCloseTo(0.0423722);
	});

	it('should calculate unit values', () => {
		const ts = new TimeSpan(1234567890);
		expect(ts.milliseconds).toBe(890);
		expect(ts.seconds).toBe(7);
		expect(ts.minutes).toBe(56);
		expect(ts.hours).toBe(6);
		expect(ts.days).toBe(14);
	});
});
