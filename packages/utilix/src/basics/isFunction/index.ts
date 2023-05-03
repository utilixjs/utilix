export function isFunction<T extends Function>(value?: any): value is T {
	return typeof value === 'function';
}