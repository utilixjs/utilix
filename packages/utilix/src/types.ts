export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Func<TResult = void, TArgs extends any[] = []> = (...args: TArgs) => TResult;
export type Action<TArgs extends any[] = []> = Func<void, TArgs>;
