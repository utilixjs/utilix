import type { Action } from "@/types";
import { isNumber } from "@/basics/isNumber";

/**
 * Interface that represent a repeated calls of a function.
 */
export interface IInterval {
	/** Delay in milliseconds. */
	readonly delay?: number;
	/** Whether the interval is currently active. */
	readonly isActive: boolean;

	/** Pauses the interval. */
	pause(): void;
	/** Resumes the interval. */
	resume(): void;
}

/**
 * Options for the Interval class.
 */
export interface IntervalOptions {
	/** Delay in milliseconds. */
	delay?: number;
	/** Whether to start the interval immediately. */
	immediate?: boolean;
}

/**
 * Represents a repeated calls of a function with a time delay between each call.
 *
 * @template TArgs Type of arguments to pass to the callback function.
 */
export class Interval<TArgs extends any[] = []> implements IInterval {
	private readonly _cb: Action<TArgs>;
	private readonly _delay?: number;
	private readonly _args: TArgs;

	private _intervalId: ReturnType<typeof setInterval> | null = null;
	private _isActive = false;

	/**
	 * Creates a new Interval.
	 *
	 * @param callback The function to be called when the interval elapses.
	 * @param delay The delay between each call in milliseconds.
	 */
	constructor(callback: Action, delay?: number);
	/**
	 * Creates a new Interval.
	 *
	 * @param callback The function to be called when the interval elapses.
	 * @param options The options for the interval.
	 */
	constructor(callback: Action, options?: IntervalOptions);
	/**
	 * Creates a new Interval.
	 *
	 * @param callback The function to be called when the interval elapses.
	 * @param options The options for the interval.
	 * @param args Arguments to pass to the callback function.
	 */
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

	/** @inheritdoc */
	get isActive() {
		return this._isActive;
	}

	/** @inheritdoc */
	get delay() {
		return this._delay;
	}

	private clean() {
		if (this._intervalId) {
			clearInterval(this._intervalId);
			this._intervalId = null;
		}
	}

	/** @inheritdoc */
	pause() {
		this._isActive = false;
		this.clean();
	}

	/** @inheritdoc */
	resume() {
		this._isActive = true;
		this.clean();
		this._intervalId = setInterval(this._cb, this._delay, ...this._args);
	}
}
