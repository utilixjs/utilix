/**
 * Checks if the passed value is classified as a primitive boolean.
 *
 * @param value The value to check.
 * @returns `true` if value is a boolean, otherwise `false`.
 */
export function isBoolean(value: unknown): value is boolean {
	return typeof value === 'boolean'; // or value === true || value === false
}

/**
 * Checks if the passed value is classified as a `Boolean` primitive or object.
 *
 * @param value The value to check.
 * @returns `true` if value is a boolean or `Boolean` object, otherwise `false`.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isBooleanObject(value: unknown): value is boolean | Boolean {
	return isBoolean(value) || (value instanceof Boolean);
}
