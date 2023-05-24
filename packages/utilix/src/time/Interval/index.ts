import type { Action } from "@/types";
import { isNumber } from "@/basics/isNumber";

export interface IInterval {
	readonly delay?: number;
	readonly isActive: boolean;

	pause(): void;
	resume(): void;
}

export interface IntervalOptions {
	delay?: number;
	immediate?: boolean;
}

export class Interval<TArgs extends any[] = []> implements IInterval {
	private readonly _cb: Action<TArgs>;
	private readonly _delay?: number;
	private readonly _args: TArgs;

	private _intervalId: ReturnType<typeof setInterval> | null = null;
	private _isActive = false;

	constructor(callback: Action, delay?: number);
	constructor(callback: Action, options?: IntervalOptions);
	constructor(callback: Action<TArgs>, delay?: number, ...args: TArgs);
	constructor(callback: Action<TArgs>, options?: number | IntervalOptions, ...args: TArgs);
	constructor(callback: Action<TArgs>, options: number | IntervalOptions = {}, ...args: TArgs) {
		this._args = args;
		this._cb = callback;

		if (isNumber(options))
			options = { delay: options };

		this._delay = options.delay;
		if (options.immediate ?? true)
			this.resume();
	}

	get isActive() {
		return this._isActive;
	}

	get delay() {
		return this._delay;
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
