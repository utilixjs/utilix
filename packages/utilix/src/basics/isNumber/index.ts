export function isNumber(value?: any): value is number {
	return typeof value === 'number';
}

export function isNumberObject(value?: any): value is number | Number {
	return isNumber(value) || (value instanceof Number);
}