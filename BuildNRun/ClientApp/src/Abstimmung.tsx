import React, { Component, useEffect, useRef, useState } from 'react';
import RootState from './RootState';
import {
    Link
} from "react-router-dom";
import { EigeneAbstimmungenModel } from './service/client';

export interface AbstimmungViewProps {
    rootState: RootState;
}

export default function AbstimmungView(props: AbstimmungViewProps) {
    const uiState = props.rootState.getGlobalState().uiState;
    const isMountedRef = useRef<number>(0);
    const [model, setModel] = useState<EigeneAbstimmungenModel>();
    useEffect(() => {
        isMountedRef.current = 1;
        props.rootState.getServices().client.getAbstimmung().then((m) => {
            setModel(m);
            return null;
        });
        return () => { isMountedRef.current = -1; };
    }, []);
    const handleVote = (vote: string) => {
        const handle = async (vote: string) => {
            props.rootState.getServices().client.setAbstimmung(vote).then((m) => {
                setModel(m);
                return null;
            });
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
                        {
                            model?.eigeneAbstimmungen?.map((a) => {
                                return (
                                    <tr>
                                        <td>{a.aktion}</td>
                                        <td>{a.anzahl}</td>
                                        <td><button onClick={() => handleVote(a.aktion!)}>abstimmen</button></td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="pageSectionButton">
                <Link to="/">Zurück</Link>
            </div>
        </div>
    );
}