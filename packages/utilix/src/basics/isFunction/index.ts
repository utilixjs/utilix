/**
 * Checks if value is classified as a function.
 *
 * @param value The value to check.
 * @returns `true` if value is a function, otherwise `false`.
 */
export function isFunction(value: unknown): value is (...args: any[]) => any {
	return typeof value === 'function';
}
