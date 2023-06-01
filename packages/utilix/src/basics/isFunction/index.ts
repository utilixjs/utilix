export function isFunction<T extends Function>(value?: unknown): value is T {
	return typeof value === 'function';
}
