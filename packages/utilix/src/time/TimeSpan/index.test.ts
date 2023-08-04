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

	it('should initializes with multi args overloads', () => {
		expect(new TimeSpan(1.5, 30).toString()).toBe('00:02:00');
		expect(new TimeSpan(1, 100, 10).toString()).toBe('02:40:10');
		expect(new TimeSpan(1, 2, 3, 4).toString()).toBe('1.02:03:04');
		expect(new TimeSpan(11, 1, 11, 10, 1).toString()).toBe('11.01:11:10.001');
	});

	it('should initializes from time units', () => {
		expect(TimeSpan.fromDays(1.23456).toString()).toBe('1.05:37:45.984');
		expect(TimeSpan.fromHours(0.2539).toString()).toBe('00:15:14.040');
		expect(TimeSpan.fromMinutes(60).toString()).toBe('01:00:00');
		// Try 32.157
		expect(TimeSpan.fromSeconds(32.156).toString()).toBe('00:00:32.156');
	});
});

describe('TimeSpan format', () => {
	it('should get default format', () => {
		const ts = new TimeSpan(1234567890);
		expect(ts.formatted).toBe('14.06:56:07.890');
	});

	it('should convert to string using custom format', () => {
		const ts = new TimeSpan(123456);
		expect(ts.toString('mm:ss.ff')).toBe('02:03.45');
	});

	it('should format positive or negative sign', () => {
		const ts1 = new TimeSpan(123456);
		expect(ts1.toString('-mm:ss.fff')).toBe('02:03.456');
		expect(ts1.toString('+mm:ss.fff')).toBe('+02:03.456');

		const ts2 = new TimeSpan(-123456);
		expect(ts2.toString('-mm:ss.fff')).toBe('-02:03.456');
		expect(ts2.toString('+mm:ss.fff')).toBe('-02:03.456');
		expect(ts2.toString('mm:ss.fff')).toBe('02:03.456');
	});

	it('should format total values', () => {
		const ts = new TimeSpan(1234567890);
		expect(ts.toString('H')).toBe('342');
		expect(ts.toString('M')).toBe('20576');
		expect(ts.toString('S')).toBe('1234567');
	});

	it('should format unit values', () => {
		const ts = new TimeSpan(1234567890);
		expect(ts.toString('d')).toBe('14');
		expect(ts.toString('h')).toBe('6');
		expect(ts.toString('m')).toBe('56');
		expect(ts.toString('s')).toBe('7');
		expect(ts.toString('f')).toBe('8');
		expect(ts.toString('ff')).toBe('89');
	});

	it('should format values padded with leading zeros', () => {
		const ts = new TimeSpan(1234567890);
		expect(ts.toString('ddddd')).toBe('00014');
		expect(ts.toString('hh')).toBe('06');
		expect(ts.toString('MMM')).toBe('20576');
		expect(ts.toString('ss')).toBe('07');
	});

	it('should escape character in format', () => {
		const ts = new TimeSpan(1234567890);
		expect(ts.toString('\\S: S')).toBe('S: 1234567');
	});

	it('should escape literal string delimiter in format', () => {
		const ts = new TimeSpan(3661000);
		expect(ts.toString("'Time:' hh:mm:ss")).toBe('Time: 01:01:01');
	});

	it('should conditionally print when the value of the total number is not zero', () => {
		const ts1 = new TimeSpan(90000);
		expect(ts1.toString('[HH\\:]mm:ss[\\.ff]')).toBe('01:30');

		const ts2 = new TimeSpan(518651005);
		expect(ts2.toString('[d\\.][hh\\:]mm:ss[\\.ff]')).toBe('6.00:04:11');
	});
});

describe('TimeSpan parse', () => {
	it('should parse numbers as total milliseconds', () => {
		expect(TimeSpan.parse('12345').totalSeconds).toBe(12.345);
		expect(TimeSpan.parse('-54321').totalSeconds).toBe(-54.321);
		expect(TimeSpan.parse('-543.21').totalSeconds).toBeCloseTo(-0.543);
	});

	it('should parse time formats', () => {
		expect(TimeSpan.parse('01:20:30').totalSeconds).toBe(4830);
		expect(TimeSpan.parse('77:88:99.100').toString()).toBe('3.06:29:39.100');
		expect(TimeSpan.parse('1:1').totalSeconds).toBe(61);
	});

	it('should parse time units', () => {
		expect(TimeSpan.parse('24h').totalDays).toBe(1);
		expect(TimeSpan.parse('456.78s').toString()).toBe('00:07:36.780');
		expect(TimeSpan.parse('-1m').totalMinutes).toBe(-1);
		expect(TimeSpan.parse('1d2ms').toString()).toBe('1.00:00:00.002');
	});
});
