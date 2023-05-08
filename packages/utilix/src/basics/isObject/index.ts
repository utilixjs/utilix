import { toTypeString } from "../../.internal/toTypeString";

export function isObject(value?: any): value is object {
	return typeof value === 'object' && value !== null;
}

export function isPlainObject(value?: any): value is Record<any, any> {
	return toTypeString(value) === '[object Object]';
}
