export function isNumber(value?: unknown): value is number {
	return typeof value === 'number';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isNumberObject(value?: unknown): value is number | Number {
	return isNumber(value) || (value instanceof Number);
}
