import { noop } from "@/utils";
import { IInterval, Interval, IntervalOptions } from "../Interval";

/**
 * The state of the Elapse instance.
 */
export type ElapseState = 'inactive' | 'active' | 'paused';

/**
 * Options for the Elapse class.
 */
export interface ElapseOptions {
	/** The interval or options for the interval. */
	interval?: number | IntervalOptions;
	/** Function that returns the current timestamp. */
	timestamp?: () => number;
	/** Function to be called on each tick. */
	onTick?: (time: number) => void;
}

/**
 * Calculates and tracks the elapsed time.
 */
export class Elapse {
	private readonly _interval: IInterval;
	private readonly _now: () => number;

	private _acum = 0;
	private _lsTime: number;

	/**
	 * Creates a new Elapse instance.
	 *
	 * @param options The options for the elapse timer.
	 */
	constructor(options: ElapseOptions = {}) {
		this._now = options.timestamp ?? Date.now;
		this._lsTime = this._now();

		const cb = options.onTick;
		this._interval = new Interval(cb ? () => {
			cb(this.time);
		} : noop, options.interval);
	}

	/** The current state of the elapse timer. */
	get state(): ElapseState {
		return this._interval.isActive ? 'active' : (this._acum ? 'paused' : 'inactive');
	}

	/** The elapsed time. */
	get time() {
		const t = this._acum + (this._interval.isActive ? this._now() - this._lsTime : 0);
		const d = this._interval.delay;

		return d ? t - (t % d) : t;
	}

	private reset() {
		this._lsTime = this._now();
		this._acum = 0;
	}

	/** Starts the elapse timer. */
	start() {
		this.reset();
		this._interval.resume();
	}

	/** Pauses the elapse timer. */
	pause() {
		this._interval.pause();
		const tn = this._now();
		this._acum += (tn - this._lsTime);
	}

	/** Resumes the elapse timer. */
	resume() {
		if (this._interval.isActive)
			return;

		this._lsTime = this._now();
		this._interval.resume();
	}

	/** Stops the elapse timer. */
	stop() {
		this._interval.pause();
		this.reset();
	}
}
