/**
 * Checks if value is classified as a primitive number.
 *
 * @param value The value to check.
 * @returns `true` if value is a number, otherwise `false`.
 */
export function isNumber(value: unknown): value is number {
	return typeof value === 'number';
}

/**
 * Checks if value is classified as a `Number` primitive or object.
 *
 * @param value The value to check.
 * @returns `true` if value is a number or `Number` object, otherwise `false`.
 */
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export function isNumberObject(value: unknown): value is number | Number {
	return isNumber(value) || (value instanceof Number);
}

/**
 * Checks if value is classified as a primitive number or numeric string.
 *
 * @param value The value to check.
 * @returns `true` if value is a number or numeric string, otherwise `false`.
 */
export function isNumeric(value: unknown): value is number | string {
	switch (typeof value) {
		case 'number':
			return value - value === 0;
		case 'string':
			if (value.trim() !== '')
				return Number.isFinite(+value);
			return false;
		default:
			return false;
	}
}
