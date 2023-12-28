import { toValue } from "@/utils";
import type { ValueOrGetter } from "@/types";
import { type ElapseState, type ElapseOptions, Elapse } from "../Elapse";

/**
 * The state of the Timer instance.
 */
export type TimerState = ElapseState | 'finished';

/**
 * Options for the Timer class.
 */
export interface TimerOptions extends ElapseOptions {
	/** Stops the interval when the countdown finishes. */
	stopOnFinish?: boolean;
}

/**
 * Timer that counts down a time value.
 */
export class Timer {
	private readonly _elapse: Elapse;
	private readonly _stopOnFinish: boolean;
	private readonly _initTime: ValueOrGetter<number>;

	private _finished: boolean;

	/**
	 * Creates a new Timer.
	 *
	 * @param time The initial time for the timer.
	 * @param options The options for the timer.
	 */
	constructor(time: ValueOrGetter<number>, options: TimerOptions = {}) {
		this._initTime = time;
		this._stopOnFinish = options.stopOnFinish ?? true;
		this._finished = this.initTime <= 0;

		const cb = options.onTick;
		this._elapse = new Elapse({ ...options, onTick: (cb ? () => {
			this.update();
			cb(this.time);
		} : () => this.update()) });
	}

	/** Get the initial time value. */
	get initTime() {
		return toValue(this._initTime);
	}

	/** Get the countdown time value. */
	get time() {
		return (this._finished && this._stopOnFinish) ? 0 : (this.initTime - this._elapse.time);
	}

	/** Get the current state of the timer. */
	get state(): TimerState {
		return this._finished ? 'finished' : this._elapse.state;
	}

	private update() {
		if (!this._finished && this.time <= 0) {
			this._finished = true;
			if (this._stopOnFinish)
				this._elapse.stop();
		}
	}

	private reset() {
		this._finished = false;
	}

	/** Starts the timer. */
	start() {
		this.reset();
		this._elapse.start();
	}

	/** Pauses the timer. */
	pause() {
		this._elapse.pause();
	}

	/** Resumes the timer. */
	resume() {
		this._elapse.resume();
	}

	/** Stops the timer. */
	stop() {
		this.reset();
		this._elapse.stop();
	}
}
