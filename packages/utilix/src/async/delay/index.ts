/**
 * Create a promise which resolves after specified number of milliseconds.
 *
 * @param ms Number of milliseconds to delay the promise.
 * @returns A promise which resolves after the specified milliseconds.
 */
export function delay(ms: number): Promise<void>;

/**
 * Create a promise which resolves given value after specified number of milliseconds.
 *
 * @template TRes Type of the value that will be resolved.
 * @param ms Number of milliseconds to delay the promise.
 * @param value A value to resolve in the returned promise.
 * @returns A promise that resolve the given value after the specified milliseconds.
 */
export function delay<TRes>(ms: number, value: TRes | PromiseLike<TRes>): Promise<TRes>;

export function delay<TRes>(ms: number, value?: TRes | PromiseLike<TRes>) {
	return new Promise<TRes>(resolve => setTimeout(() => resolve(value!), ms));
}
