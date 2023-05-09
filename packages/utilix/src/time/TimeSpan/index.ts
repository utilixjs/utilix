import { isFunction } from "../../basics/isFunction";

const msSecond = 1000
const secMinute = 60
const minHour = 60
const hrDay = 24
const msMinute = msSecond * secMinute // 60,000
const msHour = msMinute * minHour // 3,600,000
const msDay = msHour * hrDay // 86,400,000

export class TimeSpan {
	constructor(private readonly ms: number | (() => number)) {
	}

	get totalMilliseconds() {
		return isFunction(this.ms) ? this.ms() : this.ms;
	}

	get totalSeconds() {
		return this.totalMilliseconds / msSecond;
	}

	get totalMinutes() {
		return this.totalMilliseconds / msMinute;
	}

	get totalHours() {
		return this.totalMilliseconds / msHour;
	}

	get totalDays() {
		return this.totalMilliseconds / msDay;
	}

	get milliseconds() {
		return this.totalMilliseconds % msSecond;
	}

	get seconds() {
		return Math.trunc(this.totalSeconds) % secMinute;
	}

	get minutes() {
		return Math.trunc(this.totalMinutes) % minHour;
	}

	get hours() {
		return Math.trunc(this.totalHours) % hrDay;
	}

	get days() {
		return Math.trunc(this.totalDays);
	}

	get formatted() {
		let str = '';
		const isNegative = (this.totalMilliseconds < 0),
			d = Math.abs(this.days),
			h = Math.abs(this.hours),
			m = Math.abs(this.minutes),
			s = Math.abs(this.seconds),
			f = Math.abs(this.milliseconds);

		if (isNegative)
			str += '-';
		if (d)
			str += `${d.toString().padStart(2, '0')}.`;
		if (h || d)
			str += `${h.toString().padStart(2, '0')}:`;
		str += `${m.toString().padStart(2, '0')}:`;
		str += `${s.toString().padStart(2, '0')}`;
		if (f)
			str += `.${f.toString().slice(0, 2).padEnd(2, '0')}`;

		return str;
	}
}
