import type { ValueOrGetter } from "@/types";
import { isFunction } from "@/basics/isFunction";

export function toValue<T>(value: ValueOrGetter<T>): T {
	return isFunction(value) ? value() : value;
}
