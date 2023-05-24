export function isString(value?: any): value is string {
	return typeof value === 'string';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isStringObject(value?: any): value is string | String {
	return isString(value) || (value instanceof String);
}
