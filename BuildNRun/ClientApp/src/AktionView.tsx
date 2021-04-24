import React, { Component, useEffect, useRef, useState } from 'react';
import RootState from './RootState';
import {
    Link
} from "react-router-dom";
import { AktionenModel } from './service/client';

export interface AktionViewProps {
    rootState: RootState;
}

export default function AktionView(props: AktionViewProps) {
    const uiState = props.rootState.getGlobalState().uiState;

    const isMountedRef = useRef<number>(0);
    const [model, setModel] = useState<AktionenModel>();
    const [update, setUpdate] = useState<number>(0);
    useEffect(() => {
        isMountedRef.current = 1;
        props.rootState.getServices().client.getAktionenList().then((m) => {
            setModel(m);
            return null;
        });
        return () => { isMountedRef.current = -1; };
    }, []);
    const handleBuy = (vote: string) => {
        const handle = async (vote: string) => {
            props.rootState.getServices().client.kaufAktion(vote).then((m) => {
                props.rootState.getGlobalState().setUserModel(m);
                setUpdate(update+1);
                return null;
            });
        };
        handle(vote);
    };
    return (
        <div className="page">
            <div className="pageSectionTop">
            Aktion  | <Link to="/">Zurück</Link> <br />
            Geld: {uiState.userModel.money} | Baumhaus: {uiState.baumhaus} | Berg: {uiState.berg} | Zelt: {uiState.zelt }
            </div>
            <div className="pageSectionContent">
                <div>
                    
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td>Aktion</td>
                            <td>Level</td>
                            <td style={{fontSize:"7px"}}>
                                Baumhaus<br />
                                Zelt<br />
                                Berg
                            </td>
                            <td></td>
                        </tr>
                        {
                            model?.aktionen?.map((a) => {
                                return (
                                    <tr>
                                        <td>
                                            <img src={`/img/${a.name}.png`} />
                                        </td>
                                        <td>{a.name}<br/>{a.level}</td>
                                        <td style={{fontSize:"7px"}}>
                                            {a.baumhaus}<br />
                                            {a.berg}<br />
                                            {a.zelt}
                                            </td>
                                        <td><button onClick={() => handleBuy(a.name!)}>kaufen</button></td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="pageSectionButton">
            </div>
        </div>
    );
}