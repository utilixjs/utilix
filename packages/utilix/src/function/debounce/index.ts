import type { AnyFunc } from '@/types';
import { isNumber } from "@/basics/isNumber";
import { timeout } from '../timeout';

export interface DebounceOptions {
	/** The number of milliseconds to delay. */
	timeout?: number;
	/** The maximum time func is allowed to be delayed before it’s invoked. */
	maxWait?: number;
	/** Specify invoking on the leading edge of the timeout. */
	leading?: boolean;
	/** Specify invoking on the trailing edge of the timeout. */
	trailing?: boolean;
}

export interface DebouncedFunc<T extends AnyFunc> {
	/**
	 * Call the original function, but applying the debounce rules.
	 *
	 * If the debounced function can be run immediately, this calls it and returns its return
	 * value.
	 *
	 * Otherwise, it returns the return value of the last invocation, or undefined if the debounced
	 * function was not invoked yet.
	 */
	(...args: Parameters<T>): ReturnType<T> | undefined;

	/**
	 * Throw away any pending invocation of the debounced function.
	 */
	cancel(): void;

	/**
	 * If there is a pending invocation of the debounced function, invoke it immediately and return
	 * its return value.
	 *
	 * Otherwise, return the value from the last invocation, or undefined if the debounced function
	 * was never invoked.
	 */
	flush(): ReturnType<T> | undefined;

	/**
	 * Returns `true` if the debounced function is waiting to be invoked.
	 */
	readonly isPending: boolean;
}

export interface DebouncedFuncLeading<T extends AnyFunc> extends DebouncedFunc<T> {
	(...args: Parameters<T>): ReturnType<T>;
	flush(): ReturnType<T>;
}


/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since
 * the last time the debounced function was invoked.
 *
 * @param func The function to debounce.
 * @param timeout The number of milliseconds to delay.
 * @return Returns the new debounced function.
 */
export function debounce<T extends AnyFunc>(func: T, timeout?: number): DebouncedFunc<T>;

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since
 * the last time the debounced function was invoked.
 *
 * @param func The function to debounce.
 * @param options The options object.
 * @return Returns the new debounced function.
 */
export function debounce<T extends AnyFunc>(func: T, options: DebounceOptions): DebouncedFunc<T>;

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since
 * the last time the debounced function was invoked.
 *
 * @param func The function to debounce.
 * @param options The options object.
 * @return Returns the new debounced function.
 */
export function debounce<T extends AnyFunc>(func: T, options: DebounceOptions & { leading: true; }): DebouncedFuncLeading<T>;
export function debounce<T extends AnyFunc>(func: T, options: number | DebounceOptions = {}) {
	if (isNumber(options))
		options = { timeout: options };

	const {
		leading = false,
		trailing = true
	} = options;

	const
		wait = +(options.timeout ?? 0),
		maxing = 'maxWait' in options,
		maxWait = maxing ? Math.max(+(options.maxWait ?? 0), wait) : options.maxWait!;

	const timer = timeout(timerExpired, wait, false);

	let lastArgs: Parameters<T> | undefined,
		lastThis: ThisParameterType<T> | undefined,
		result: ReturnType<T> | undefined,
		lastCallTime: number | undefined,
		lastInvokeTime = 0;

	/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */

	function invokeFunc(time: number) {
		const args = lastArgs;
		const thisArg = lastThis;

		lastArgs = lastThis = undefined!;
		lastInvokeTime = time;

		result = func.apply(thisArg, args!);
		return result;
	}

	function leadingEdge(time: number) {
		lastInvokeTime = time;
		timer.start();
		return leading ? invokeFunc(time) : result;
	}

	function remainingWait(time: number) {
		const timeSinceLastCall = time - lastCallTime!;
		const timeSinceLastInvoke = time - lastInvokeTime;
		const timeWaiting = wait - timeSinceLastCall;

		return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
	}

	function shouldInvoke(time: number) {
		const timeSinceLastCall = time - lastCallTime!;
		const timeSinceLastInvoke = time - lastInvokeTime;

		// Either this is the first call, activity has stopped and we're at the
		// trailing edge, the system time has gone backwards and we're treating
		// it as the trailing edge, or we've hit the `maxWait` limit.
		return (
			lastCallTime === undefined ||
			timeSinceLastCall >= wait ||
			timeSinceLastCall < 0 ||
			(maxing && timeSinceLastInvoke >= maxWait)
		);
	}

	function timerExpired() {
		const time = Date.now();
		if (shouldInvoke(time)) {
			return trailingEdge(time);
		}

		timer.start(remainingWait(time));
		return undefined;
	}

	function trailingEdge(time: number) {
		if (trailing && lastArgs) {
			return invokeFunc(time);
		}
		lastArgs = lastThis = undefined!;
		return result;
	}

	function debounced(...args: Parameters<T>) {
		const time = Date.now();
		const isInvoking = shouldInvoke(time);

		lastArgs = args;
		// @ts-ignore: ignore
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		lastThis = this;
		lastCallTime = time;

		if (isInvoking) {
			if (!timer.isPending) {
				return leadingEdge(lastCallTime);
			}
			if (maxing) {
				// Handle invocations in a tight loop.
				timer.start();
				return invokeFunc(lastCallTime);
			}
		}
		if (!timer.isPending) {
			timer.start();
		}
		return result;
	}

	debounced.cancel = () => {
		if (timer.isPending) {
			timer.cancel();
		}
		lastInvokeTime = 0;
		lastArgs = lastCallTime = lastThis = undefined;
	};

	debounced.flush = () => {
		return !timer.isPending ? result : trailingEdge(Date.now());
	};

	Object.defineProperty(debounced, 'isPending', {
		get() {
			return timer.isPending;
		},
	});

	return debounced;
}
