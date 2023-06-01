const objToString = Object.prototype.toString;

export function toTypeString(value?: unknown): string {
	return objToString.call(value);
}
