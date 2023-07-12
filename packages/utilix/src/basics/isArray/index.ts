export const isArray = Array.isArray;

function isLength(value?: unknown) {
	return typeof value === 'number' && value > -1 &&
		value % 1 === 0 && value <= Number.MAX_SAFE_INTEGER;
}

export function isArrayLike(value?: unknown): value is ArrayLike<unknown> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return value != null && typeof value !== 'function' && isLength((value as any).length);
}
