import React, { Component } from 'react';
import RootState from './RootState';
import {
    Link
} from "react-router-dom";

export interface HomeViewProps {
    rootState: RootState;
}

export default function HomeView(props: HomeViewProps) {
    return (
        <div className="page">
            <div className="pageSectionTop">
                HomeView
            </div>
            <div className="pageSectionContent">
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <img width="100px" src="/img/coin.png" />
                                    <br />
                                    200
                                </td>
                                <td>

                                </td>
                                <td>
                                    <img width="200px" src="/img/Aktion.png" />
                                </td>
                                <td>
                                    <img width="200px" src="/img/Waage.png" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ paddingLeft: 10 }}>
                    <img width="200px" src="/img/Baumhaus-1.png" />
                    <img width="200px" src="/img/Zelt-1.png" />
                    <img width="200px" src="/img/Berg-1.png" />
                </div>
            </div>
            <div className="pageSectionButton">
                <Link to="/">Play</Link> | <Link to="/plan">Plan</Link> | <Link to="/run">Run</Link>
            </div>
        </div>
    );
}