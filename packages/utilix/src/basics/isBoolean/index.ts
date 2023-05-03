export function isBoolean(value?: any): value is boolean {
	return typeof value === 'boolean'; // or value === true || value === false
}

export function isBooleanObject(value?: any): value is boolean | Boolean {
	return isBoolean(value) || (value instanceof Boolean);
}