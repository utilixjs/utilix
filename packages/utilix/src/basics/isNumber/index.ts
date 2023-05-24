export function isNumber(value?: any): value is number {
	return typeof value === 'number';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isNumberObject(value?: any): value is number | Number {
	return isNumber(value) || (value instanceof Number);
}
