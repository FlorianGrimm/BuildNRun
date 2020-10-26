export type PreConditionResult<T> = [true, T] | [false, null];
export type PreCondition<A, T> = (arg: A) => PreConditionResult<T>;
export type PromiseResolve<T> = (value?: T | PromiseLike<T>) => void;
export type PromiseReject = (reason?: any) => void;
export type PromiseExecutor<T> = (resolve: PromiseResolve<T>, reject: PromiseReject) => void;