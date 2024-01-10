export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Mutable<Type> = {
	-readonly [P in keyof Type]: Type[P];
};

export type Func<TResult = void, TArgs extends any[] = []> = (...args: TArgs) => TResult;
export type Action<TArgs extends any[] = []> = Func<void, TArgs>;
export type AnyFunc = Func<any, any[]>;

export type ValueOrGetter<T> = T | Func<T>;
export type Awaitable<T> = T | PromiseLike<T>;
