/**
 * Checks if value is classified as a primitive string.
 *
 * @param value The value to check.
 * @returns `true` if value is a string, otherwise `false`.
 */
export function isString(value?: unknown): value is string {
	return typeof value === 'string';
}

/**
 * Checks if value is classified as a `String` primitive or object.
 *
 * @param value The value to check.
 * @returns `true` if value is a string or `String` object, otherwise `false`.
 */
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export function isStringObject(value?: unknown): value is string | String {
	return isString(value) || (value instanceof String);
}
