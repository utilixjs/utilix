export const isArray = Array.isArray;

function isLength(value?: any) {
	return typeof value === 'number' && value > -1 &&
		value % 1 === 0 && value <= Number.MAX_SAFE_INTEGER;
}

export function isArrayLike(value?: any): value is ArrayLike<any> {
	return value != null && typeof value !== 'function' && isLength(value.length);
}
