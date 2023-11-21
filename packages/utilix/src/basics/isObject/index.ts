import { toTypeString } from "@internal/toTypeString";

export function isObject(value?: unknown): value is object {
	return typeof value === 'object' && value !== null;
}

export function isPlainObject(value?: unknown): value is object {
	return toTypeString(value) === '[object Object]';
}
