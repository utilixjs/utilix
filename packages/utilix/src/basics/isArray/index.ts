/**
 * Checks if the passed value is an [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).
 * It does not check the value's prototype chain, nor does it rely on the `Array` constructor it is attached to. It returns `true`
 * for any value that was created using the array literal syntax (`[...]`) or the `Array` constructor.
 *
 * @param value The value to be checked.
 * @returns `true` if value is an `Array`; otherwise, `false`. `false` is always returned if value is
 * a [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) instance.
 */
export function isArray(value: unknown): value is any[] {
	return Array.isArray(value);
}

function isLength(value: unknown) {
	return typeof value === 'number' && value > -1 &&
		value % 1 === 0 && value <= Number.MAX_SAFE_INTEGER;
}

/**
 * Checks if the passed value is array-like. A value is considered array-like if
 * it's not a function and has a `value.length` that's an integer greater
 * than or equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @param value The value to check.
 * @returns `true` if value has a valid length, otherwise `false`.
 */
export function isArrayLike(value: unknown): value is ArrayLike<any> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return value != null && typeof value !== 'function' && isLength((value as any).length);
}
