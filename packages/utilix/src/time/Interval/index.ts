import type { Action } from "../../types";
import { isNumber } from "../../basics/isNumber";

export interface IntervalOptions {
	delay?: number;
	immediate?: boolean;
}

export class Interval<TArgs extends any[]> {
	private readonly _cb: Action<TArgs>;
	private readonly _delay?: number;
	private readonly _args: TArgs;

	private _intervalId: ReturnType<typeof setInterval> | null = null;
	private _isActive: boolean = false;

	constructor(callback: Action, delay?: number);
	constructor(callback: Action, options?: IntervalOptions);
	constructor(callback: Action<TArgs>, delay?: number, ...args: TArgs);
	constructor(callback: Action<TArgs>, options?: IntervalOptions, ...args: TArgs);
	constructor(callback: Action<TArgs>, options: number | IntervalOptions = {}, ...args: TArgs) {
		this._args = args;
		this._cb = callback;

		if (isNumber(options))
			options = { delay: options };

		const {
			delay,
			immediate = true
		} = options;

		this._delay = delay;

		if (immediate)
			this.resume();
	}

	get isActive() {
		return this._isActive;
	}

	private clean() {
		if (this._intervalId) {
			clearInterval(this._intervalId);
			this._intervalId = null;
		}
	}

	pause() {
		this._isActive = false;
		this.clean();
	}

	resume() {
		this._isActive = true;
		this.clean();
		this._intervalId = setInterval(this._cb, this._delay, ...this._args);
	}
}
