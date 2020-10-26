import { useEffect, useState } from 'react';
import { PreCondition, PromiseExecutor, PromiseReject, PromiseResolve } from './types';

type typeUsePromiseState<T> = {
    step: 0 | 1 | 2 | 3;
    promise: Promise<T> | null,
    resolve: PromiseResolve<T> | null;
    reject: PromiseReject | null;
};

const usePromiseInitalState = { step: 0, promise: null, resolve: null, reject: null };
export function usePromiseResolve<A, T>(
    arg: A,
    preCondition: PreCondition<A, T>,
    chain?: ((p: Promise<T>) => void) | null | undefined) {
    const [state, setNextState] = useState<typeUsePromiseState<T>>(usePromiseInitalState as typeUsePromiseState<T>);
    useEffect(() => {
        if (state.step === 0) {
            const e = function (resolve: PromiseResolve<T>, reject: PromiseReject) {
                const nextState: typeUsePromiseState<T> = { ...state, step: 2, resolve:resolve, reject:reject };
                setNextState(nextState);
            }
            {
                const nextState: typeUsePromiseState<T> = { ...state, step: 1 };
                const promise = new Promise(e);
                nextState.promise = promise;
                promise.then(
                    (value) => {
                        setNextState({ step: 3, promise: null,  resolve: null, reject: null });
                        return value;
                    },
                    (reason) => {
                        setNextState({ step: 3, promise: null,  resolve: null, reject: null });
                        throw reason;
                    });
                if (chain) {
                    chain(promise);
                }
                setNextState(nextState);
            }
            return ()=>{
                if (state.reject !== null){ state.reject();}
            };
        }
        if (state.step === 1) {
            // wait fo resolve
            return;
        }
        if (state.step === 2) { 
            const [success, argT] = preCondition(arg);
            if (success) {
                if (state.resolve) { 
                    state.resolve(argT!); 
                }
            }
            return;
        }
        if (state.step === 3) { 
            return;
        }
    }, [arg]);
}

export function usePromiseThan<A, T>(
    arg: A,
    preCondition: PreCondition<A, T>,
    chain: ((p: Promise<T>) => void)
) {
    //const [p, setP] = useState<typeUsePromiseInitalState<T>>({ promise: null, resovle: null, reject: null });
    const [started, setStarted] = useState(false);
    useEffect(() => {
        if (!started) {
            const [success, argT] = preCondition(arg);
            if (success) {
                setStarted(true);
                const promise = Promise.resolve<T>(argT!);
                chain(promise);
            }
        }
    }, [arg]);
}