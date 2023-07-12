export function isNumber(value?: unknown): value is number {
	return typeof value === 'number';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isNumberObject(value?: unknown): value is number | Number {
	return isNumber(value) || (value instanceof Number);
}

export function isNumeric(value?: unknown): value is number | string {
	switch (typeof value) {
		case 'number':
			return value - value === 0;
		case 'string':
			if (value.trim() !== '')
				return Number.isFinite(+value);
			return false;
		default:
			return false;
	}
}
