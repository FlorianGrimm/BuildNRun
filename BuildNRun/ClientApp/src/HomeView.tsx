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
                Spiel
                <img src="/img/Aktion.png" />
                <img src="/img/Waage.png" />
                <img src="/img/Baumhaus-1.png" />
                <img src="/img/Zelt-1.png" />
                <img src="/img/Berg-1.png" />
            </div>
            <div className="pageSectionButton">
                <Link to="/">Play</Link> | <Link to="/plan">Plan</Link> | <Link to="/run">Run</Link>
            </div>
        </div>
    );    
}