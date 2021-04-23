import React, { Component, useEffect, useRef } from 'react';
import RootState from './RootState';
import {
    Link
} from "react-router-dom";

export interface AbstimmungViewProps {
    rootState: RootState;
}

export default function AbstimmungView(props: AbstimmungViewProps) {
    const uiState = props.rootState.getGlobalState().uiState;
    const isMountedRef = useRef<number>(0); 
    useEffect(()=>{
        isMountedRef.current=1;
        return ()=>{isMountedRef.current=-1;};
    },[]);
    const handleVote = (vote:string)=>{
        const handle = async (vote:string)=>{
            const x=await props.rootState.getServices().client.build();
            console.log( x.baumhaus);
        };
        handle(vote);
    };
    return (
        <div className="page">
            <div className="pageSectionTop">
                Abstimmung
            </div>
            <div className="pageSectionContent">
                <table>
                    <tbody>
                        <tr>
                            <td>Aktion</td>
                            <td>Anzahl</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>aaaaa</td>
                            <td>1</td>
                            <td><button onClick={()=> handleVote("aaaaa")}>Dafür abstimmen</button></td>
                        </tr>
                        <tr>
                            <td>bbbbb</td>
                            <td>1</td>
                            <td><button onClick={()=> handleVote("bbbbb")}>Dafür abstimmen</button></td>
                        </tr>
                    </tbody>
                    </table>
            </div>
            <div className="pageSectionButton">
                <Link to="/">Play</Link> | <Link to="/plan">Plan</Link> | <Link to="/run">Run</Link>
            </div>
        </div>
    );
}