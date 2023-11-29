import { toTypeString } from "@internal/toTypeString";

/**
 * Checks if value is type of object and not `null`.
 *
 * @param value The value to check.
 * @returns `true` if value is an object, otherwise `false`.
 */
export function isObject(value: unknown): value is object {
	return typeof value === 'object' && value !== null;
}

/**
 * Checks if value is a plain-object, created by object literal syntax (`{ }`),
 * or by invoking a constructor with prototype `[object Object]`.
 *
 * @param value The value to check.
 * @returns `true` if value is a plain-object, otherwise `false`.
 */
export function isPlainObject(value: unknown): value is object {
	return toTypeString(value) === '[object Object]';
}
