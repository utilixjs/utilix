// eslint-disable-next-line @typescript-eslint/unbound-method
const objToString = Object.prototype.toString;

export function toTypeString(value?: unknown): string {
	return objToString.call(value);
}
