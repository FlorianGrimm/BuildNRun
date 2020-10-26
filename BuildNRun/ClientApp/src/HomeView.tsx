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
            </div>
            <div className="pageSectionButton">
                <Link to="/">Play</Link> | <Link to="/plan">Plan</Link> | <Link to="/run">Run</Link>
            </div>
        </div>
    );    
}