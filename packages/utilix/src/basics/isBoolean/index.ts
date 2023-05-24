export function isBoolean(value?: any): value is boolean {
	return typeof value === 'boolean'; // or value === true || value === false
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isBooleanObject(value?: any): value is boolean | Boolean {
	return isBoolean(value) || (value instanceof Boolean);
}
