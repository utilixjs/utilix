import type { ValueOrGetter } from "@/types";
import { toValue } from "@/utils/toValue";

const
	msSecond = 1000,
	secMinute = 60,
	minHour = 60,
	hrDay = 24,
	msMinute = msSecond * secMinute, // 60,000
	msHour = msMinute * minHour, // 3,600,000
	msDay = msHour * hrDay; // 86,400,000

const DEFAULT_FORMAT = '-[d\\.]hh:mm:ss[\\.fff]';

/**
 * Represents a time interval (duration of time or elapsed time).
 */
export class TimeSpan {
	private _defaultFormat = DEFAULT_FORMAT;
	private readonly _ms: ValueOrGetter<number>;

	/**
	 * Initializes `TimeSpan` object to the specified number of milliseconds.
	 *
	 * @param milliseconds Number of milliseconds, or getter function that return number of milliseconds.
	 */
	constructor(milliseconds: ValueOrGetter<number>);

	/**
	 * Initializes `TimeSpan` object to a specified number of minutes, and seconds.
	 *
	 * @param minutes Number of minutes.
	 * @param seconds Number of seconds.
	 */
	constructor(minutes: number, seconds: number);

	/**
	 * Initializes `TimeSpan` object to a specified number of hours, minutes, and seconds.
	 *
	 * @param hours Number of hours.
	 * @param minutes Number of minutes.
	 * @param seconds Number of seconds.
	 */
	constructor(hours: number, minutes: number, seconds: number);

	/**
	 * Initializes `TimeSpan` object to a specified number  days, hours, minutes, seconds, and optional milliseconds.
	 *
	 * @param days Number of days.
	 * @param hours Number of hours.
	 * @param minutes Number of minutes.
	 * @param seconds Number of seconds.
	 * @param milliseconds Number of milliseconds.
	 */
	constructor(days: number, hours: number, minutes: number, seconds: number, milliseconds?: number);

	constructor(value: ValueOrGetter<number>, ...args: number[]) {
		this._ms = (!args.length) ? value : ((args.length === 1)
			? (toValue(value) * msMinute + args[0] * msSecond)
			: (args.length === 2)
				? (toValue(value) * msHour + args[0] * msMinute + args[1] * msSecond)
				: (toValue(value) * msDay + args[0] * msHour + args[1] * msMinute + args[2] * msSecond + (args[3] ?? 0)));
	}

	/**
	 * Gets the value of the TimeSpan expressed in whole milliseconds.
	 */
	get totalMilliseconds() {
		return toValue(this._ms);
	}

	/**
	 * Gets the value of the TimeSpan expressed in whole and fractional seconds.
	 */
	get totalSeconds() {
		return this.totalMilliseconds / msSecond;
	}

	/**
	 * Gets the value of the TimeSpan expressed in whole and fractional minutes.
	 */
	get totalMinutes() {
		return this.totalMilliseconds / msMinute;
	}

	/**
	 * Gets the value of the TimeSpan expressed in whole and fractional hours.
	 */
	get totalHours() {
		return this.totalMilliseconds / msHour;
	}

	/**
	 * Gets the value of the TimeSpan expressed in whole and fractional days.
	 */
	get totalDays() {
		return this.totalMilliseconds / msDay;
	}

	/**
	 * Gets the milliseconds component of the time interval.
	 */
	get milliseconds() {
		return this.totalMilliseconds % msSecond;
	}

	/**
	 * Gets the seconds component of the time interval.
	 */
	get seconds() {
		return Math.trunc(this.totalSeconds) % secMinute;
	}

	/**
	 * Gets the minutes component of the time interval.
	 */
	get minutes() {
		return Math.trunc(this.totalMinutes) % minHour;
	}

	/**
	 * Gets the hours component of the time interval.
	 */
	get hours() {
		return Math.trunc(this.totalHours) % hrDay;
	}

	/**
	 * Gets the days component of the time interval.
	 */
	get days() {
		return Math.trunc(this.totalDays);
	}

	/**
	 * Get string representation of the TimeSpan value in the default format.
	 *
	 * @experimental
	 */
	get formatted() {
		return this.toString();
	}

	/**
	 * Set the default format that will be used in `formatted` property.
	 *
	 * @param format A format string.
	 * @experimental
	 */
	setDefaultFormat(format: string) {
		this._defaultFormat = format;
	}

	/**
	 * Converts the value of the current `TimeSpan` object to string representation by using the specified format.
	 *
	 * @param format A format string.
	 * @returns The string representation of the current `TimeSpan` value in the format specified by the `format` parameter.
	 * @experimental
	 */
	toString(format = this._defaultFormat) {
		return formatTimeSpan(this, format);
	}

	/**
	 * Get a `TimeSpan` object that represents a specified number of seconds.
	 *
	 * @param value Number of seconds.
	 * @returns An object that represents `value`.
	 */
	static fromSeconds(value: ValueOrGetter<number>) {
		return fromUnit(value, msSecond);
	}

	/**
	 * Get a `TimeSpan` object that represents a specified number of minutes.
	 *
	 * @param value Number of minutes.
	 * @returns An object that represents `value`.
	 */
	static fromMinutes(value: ValueOrGetter<number>) {
		return fromUnit(value, msMinute);
	}

	/**
	 * Get a `TimeSpan` object that represents a specified number of hours.
	 *
	 * @param value Number of hours.
	 * @returns An object that represents `value`.
	 */
	static fromHours(value: ValueOrGetter<number>) {
		return fromUnit(value, msHour);
	}

	/**
	 * Get a `TimeSpan` object that represents a specified number of days.
	 *
	 * @param value Number of days.
	 * @returns An object that represents `value`.
	 */
	static fromDays(value: ValueOrGetter<number>) {
		return fromUnit(value, msDay);
	}

	/**
	 * Converts a string representation of a time interval to its `TimeSpan` equivalent.
	 *
	 * @param str A string that specifies the time interval to convert.
	 * @returns TimeSpan object
	 */
	static parse(str: string) {
		const num = Number(str);
		if (Number.isNaN(num)) {
			const match = (REGEX_SPARSE.exec(str)) ?? (REGEX_TPARSE.exec(str));
			if (match) {
				const sign = (match[1] === '-') ? -1 : 1;
				return new TimeSpan(
					Number(match[2] ?? 0) * sign,
					Number(match[3] ?? 0) * sign,
					Number(match[4] ?? 0) * sign,
					Number(match[5] ?? 0) * sign,
					Number(match[6] ?? 0) * sign);
			}
		}

		return new TimeSpan(num);
	}
}

// This regex will generate 2 groups and only one is defined with literal
// It could generate one group for both case ('' & \) but unfortunately
// JS doesn't support Branch Reset Group (?|...) and Safari doesn't
// support Lookbehind (?<=...)
// Branch Reset exp => (?|'([^']+)'|\\(.))
// Lookbehind exp => ((?<=')[^']+(?=')|(?<=\\).)
const REGEX_LITERAL = /(?:'([^']+)'|\\(.))/;
const REGEX_SYMBOLS = /[+-]|(?:d|D|H|M|S)+|(?:h|m|s){1,2}|f{1,3}/;
const REGEX_FORMAT = new RegExp(`${REGEX_LITERAL.source}|${REGEX_SYMBOLS.source}`, 'g');
const REGEX_OPT_FORMAT = new RegExp(`\\[${REGEX_LITERAL.source}?(${REGEX_SYMBOLS.source})${REGEX_LITERAL.source}?]`, 'g');

const REGEX_SPARSE = /^([+-])?(?:(\d+(?:\.\d+)?)d)?(?:(\d+(?:\.\d+)?)h)?(?:(\d+(?:\.\d+)?)m)?(?:(\d+(?:\.\d+)?)s)?(?:(\d+(?:\.\d+)?)ms)?$/i;
const REGEX_TPARSE = /^([+-])?(?:(?:(\d+)(?:\.|:))?(\d{1,2}):)?(\d{1,2}):(\d{1,2})(?:(?:\.|:)(\d+))?$/;

function fromUnit(value: ValueOrGetter<number>, scale: number) {
	return new TimeSpan(() => toValue(value) * scale);
}

function formatNum(n: number, pad: number, opt: boolean, c = n) {
	return (!opt || c >= 1) ? String(n).padStart(pad, '0') : '';
}

function formatUnit(num: number, total: number, pad: number, opt: boolean) {
	return formatNum(Math.abs(num), pad, opt, Math.abs(total));
}

function formatTotal(total: number, pad: number, opt: boolean) {
	return formatNum(Math.trunc(Math.abs(total)), pad, opt);
}

const matches: Record<string, (ts: TimeSpan, pad: number, opt: boolean) => string> = {
	'+': ({ totalMilliseconds: ms }) => (ms >= 0) ? '+' : '-',
	'-': ({ totalMilliseconds: ms }) => (ms < 0) ? '-' : '',
	'd': (ts, pad, opt) => formatUnit(ts.days, ts.totalDays, pad, opt),
	'D': (ts, pad, opt) => formatTotal(ts.totalDays, pad, opt),
	'h': (ts, pad, opt) => formatUnit(ts.hours, ts.totalHours, pad, opt),
	'H': (ts, pad, opt) => formatTotal(ts.totalHours, pad, opt),
	'm': (ts, pad, opt) => formatUnit(ts.minutes, ts.totalMinutes, pad, opt),
	'M': (ts, pad, opt) => formatTotal(ts.totalMinutes, pad, opt),
	's': (ts, pad, opt) => formatUnit(ts.seconds, ts.totalSeconds, pad, opt),
	'S': (ts, pad, opt) => formatTotal(ts.totalSeconds, pad, opt),
	'f': (ts, pad, opt) => {
		const ms = String(Math.trunc(Math.abs(ts.milliseconds))).padStart(3, '0').slice(0, pad);
		return (!opt || !/^0+$/.test(ms)) ? ms : '';
	}
};

/**
 * Converts the value of a `TimeSpan` object to string representation by using the specified format.
 *
 * @param ts The `TimeSpan` object.
 * @param formatStr A custom format string.
 * @returns The string representation of the `TimeSpan` value.
 */
export function formatTimeSpan(ts: TimeSpan, formatStr: string) {
	return formatStr.replace(REGEX_OPT_FORMAT, (_, $1: string, $2: string, $3: string, $4: string, $5: string) => {
		const f = matches[$3[0]](ts, $3.length, true);
		return f ? `${$1 ?? $2 ?? ''}${f}${$4 ?? $5 ?? ''}` : '';
	}).replace(REGEX_FORMAT, (match, $1: string, $2: string) => $1 || $2 || matches[match[0]](ts, match.length, false));
}
