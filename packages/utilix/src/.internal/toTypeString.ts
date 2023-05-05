const objToString = Object.prototype.toString;

export function toTypeString(value?: any): string {
	return objToString.call(value);
}