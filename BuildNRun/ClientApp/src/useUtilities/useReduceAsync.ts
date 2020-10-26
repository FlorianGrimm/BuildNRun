import { useEffect, useRef, useState } from "react";
import { isPromise } from "./isPromise";

export type ActionLike = { type: string };
export function readAction<TAction extends ActionLike>(stateAction: TAction[]): [false, null] | [true, TAction] {
    if (stateAction.length) {
        const result = stateAction.splice(0, 1)[0];
        return [true, result];
    }
    return [false, null];
}

type StateType<TAction, TAdditional> = {
    version: number;
    runningActions: number;
    actions: TAction[];
    pushAction: (action?: TAction) => void;
    additional: TAdditional;
};

// [isProcessing, pusjAction]
export function useReduceAsync<TAction extends ActionLike, TAdditional = any>(
    handleAction: (action: TAction, additional: TAdditional) => void | null | undefined | PromiseLike<any>,
    additional?: () => TAdditional,
    initialActions?: () => TAction[]
): [boolean, ((action?: TAction) => void)] {
    const stateActions = useRef<StateType<TAction, TAdditional>>({} as any);
    const [stateActionChanges, setStateActionChanges] = useState<number>(1);

    if (typeof stateActions.current.version === "undefined") {
        const currentState = stateActions.current;
        currentState.version = stateActionChanges;
        currentState.runningActions = 0;
        currentState.actions = [];
        if (additional) {
            currentState.additional = additional();
        }        
        const pushAction = function pushAction(action?: TAction) {
            if (action) {
                currentState.actions.push(action);
            }
            const nextVersion = ++currentState.version;
            setStateActionChanges(stateActionChanges);
        };
        currentState.pushAction = pushAction;
        if (initialActions){
            const actions = initialActions();
            if (actions){
                currentState.actions.push(...actions);
            }
        }
    }

    useEffect(() => {
        while (true) {
            const currentState = stateActions.current;
            const todo = readAction<TAction>(currentState.actions!);
            if (todo[0]) {
                var p = handleAction(todo[1], currentState.additional);
                if (isPromise(p)) {
                    currentState.runningActions++;
                    (p as Promise<any>).catch(() => {
                        currentState.runningActions--;
                        const nextVersion = ++currentState.version;
                        setStateActionChanges(nextVersion);
                    });
                }
            } else {
                return;
            }
        }
    }, [stateActionChanges]);

    {
        const currentState = stateActions.current;
        return [
            (currentState.runningActions > 0),
            currentState.pushAction
        ];
    }
}