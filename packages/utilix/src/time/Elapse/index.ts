import type { Func, Action } from "../../types";
import { IInterval, Interval, IntervalOptions } from "../Interval";

export type ElapseState = 'inactive' | 'active' | 'paused';

export interface ElapseOptions {
	interval?: number | IntervalOptions;
	timestamp?: Func<number>;
	onTick?: Action<[number]>;
}

export class Elapse {
	private readonly _interval: IInterval;
	private readonly _now: Func<number>;

	private _acum = 0;
	private _lsTime: number;

	constructor(options: ElapseOptions = {}) {
		this._now = options.timestamp ?? Date.now;
		this._lsTime = this._now();

		const cb = options.onTick;
		this._interval = new Interval(cb ? () => {
			cb(this.time);
		} : () => { }, options.interval);
	}

	get state(): ElapseState {
		return this._interval.isActive ? 'active' : (this._acum ? 'paused' : 'inactive');
	}

	get time() {
		const t = this._acum + (this._interval.isActive ? this._now() - this._lsTime : 0);
		const d = this._interval.delay;

		return d ? t - (t * d) : t;
	}

	private reset() {
		this._lsTime = this._now();
		this._acum = 0;
	}

	start() {
		this.reset();
		this._interval.resume();
	}

	pause() {
		this._interval.pause();
		const tn = this._now();
		this._acum += (tn - this._lsTime);
	}

	resume() {
		if (this._interval.isActive)
			return;

		this._lsTime = this._now();
		this._interval.resume();
	}

	stop() {
		this._interval.pause();
		this.reset();
	}
}
