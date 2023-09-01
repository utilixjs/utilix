import { isNumber } from "@/basics";

export function delay(ms: number): Promise<void>;
export function delay<TRes>(ms: number, then: PromiseLike<TRes>): Promise<TRes>;
export function delay<TRes>(ms: number, result: TRes): Promise<TRes>;
export function delay<TRes>(before: Promise<TRes>, ms: number): Promise<TRes>;
export function delay<TRes>(before: PromiseLike<TRes>, ms: number): PromiseLike<TRes>;
export function delay<TRes>(val: number | PromiseLike<TRes>, then?: TRes | PromiseLike<TRes>): PromiseLike<TRes> {
	return isNumber(val)
		? new Promise<TRes>(resolve => setTimeout(() => resolve(then!), val))
		: isNumber(then) ? val.then(r => delay(then, r)) : val;
}
