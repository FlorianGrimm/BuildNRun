import React, { useEffect, useState } from 'react';

const initalState:{
        done:boolean,
        result:(void | (() => void | undefined))
    } = {
        done:false, 
        result:undefined
    };
export function useOnce<T extends React.DependencyList>(
    action: (deps: T) => (void | (() => void | undefined)),
    condition: (deps: T) => boolean,
    deps: T
) {
    const [state, setState] = useState(initalState);
    useEffect(
        ()=>{
            if (!state){
                if (condition(deps)){
                    const result = action(deps);
                    setState({done:true,result:result});
                    return result;
                }
            }
            return state.result;
        },
        deps
    );

}