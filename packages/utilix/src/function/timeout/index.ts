import type { Action } from '@/types';
import { setClearHandler } from '@/_internal/setClearHandler';

export interface Timeout {
	/**
	 * Start the timeout.
	 * @param delay The number of milliseconds to delay.
	 * @param args The arguments to pass to the callback.
	 */
	start(delay?: number, ...args: any[]): void;
	/** Cancel the timeout. */
	cancel(): void;
	/** Whether the timeout is still pending. */
	readonly isPending: boolean;
}

/**
 * Creates a timeout that will call the callback after the delay.
 *
 * @param callback The function to call.
 * @param delay The number of milliseconds to delay.
 * @param immediate Whether to call the callback immediately.
 * @param args The arguments to pass to the callback.
 * @returns An object with a start method to start the timeout, a cancel method to cancel the timeout, and an isPending property to check if the timeout is still pending.
 */
export function timeout<TArgs extends any[]>(callback: Action<TArgs>, delay?: number, immediate = true, ...args: TArgs): Timeout {
	const caller = setClearHandler(setTimeout<TArgs>, clearTimeout);

	function start(iDelay = delay, iArgs = args) {
		caller.set((...sArgs) => {
			caller.clear();
			callback(...sArgs);
		}, iDelay, ...iArgs);
	}

	if (immediate) {
		start();
	}

	return {
		start,
		cancel: caller.clear,
		get isPending() {
			return caller.id !== null;
		}
	};
}
