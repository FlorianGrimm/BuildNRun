import React, { Component } from 'react';
import RootState from './RootState';
import {
    Link
} from "react-router-dom";

export interface HomeViewProps {
    rootState: RootState;
}

export default function HomeView(props: HomeViewProps) {
    const uiState = props.rootState.getGlobalState().uiState;
    const divbingmap = window.document.getElementById("bingmap") as HTMLDivElement | null;
    if (divbingmap) {
        if (divbingmap.style.visibility === "visible"){
            divbingmap.style.visibility = "hidden";
        }
    }

    return (
        <div className="page">
            <div className="pageSectionTop">
                Home
            </div>
            <div className="pageSectionContent">
                <table style={{maxWidth:600, textAlign:"center"}}>
                    <tbody>
                        <tr>
                            <td><Link to="/plan">Laufen</Link></td>
                            <td><Link to="/aktion">Aktion</Link></td>
                            <td><Link to="/abstimmung">Abstimmung</Link></td>
                        </tr>
                        <tr>
                            <td>
                                <div style={{position:"relative"}} >
                                <img width="100%" src="/img/Guthaben.png" alt="Guthaben" />
                                <div style={{position:"absolute", left:"60%", top:"60%", fontSize:20, fontWeight:700, color:"white"}}>{uiState.userModel.money}</div>
                                </div>
                            </td>
                            <td>
                                <img width="100%" src="/img/Aktion.png" alt="Aktion" />
                            </td>
                            <td>
                                <img width="100%" src="/img/Abstimmung.png" alt="Abstimmung" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <img width="100%" src={`/img/Baumhaus-${uiState.getBaumhausLevel()}.png`} />
                            </td>
                            <td>
                                <img width="100%" src={`/img/Zelt-${uiState.getZeltLevel()}.png`} />
                            </td>
                            <td>
                                <img width="100%" src={`/img/Berg-${uiState.getBergLevel()}.png`} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Baumhaus: {uiState.baumhaus.toLocaleString(undefined, {maximumFractionDigits:1 })}
                            </td>
                            <td>
                                Zelt: {uiState.zelt.toLocaleString(undefined, {maximumFractionDigits:1 })}
                            </td>
                            <td>
                                Berg: {uiState.berg.toLocaleString(undefined, {maximumFractionDigits:1 })}
                            </td>
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