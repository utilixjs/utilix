export function isString(value?: any): value is string {
	return typeof value === 'string';
}

export function isStringObject(value?: any): value is string | String {
	return isString(value) || (value instanceof String)
}