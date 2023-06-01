export function isString(value?: unknown): value is string {
	return typeof value === 'string';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isStringObject(value?: unknown): value is string | String {
	return isString(value) || (value instanceof String);
}
