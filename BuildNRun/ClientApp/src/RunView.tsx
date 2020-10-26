import React, { Component } from 'react';
import RootState from './RootState';
import {
    Link
} from "react-router-dom";

export interface RunViewProps { 
    rootState : RootState;
}

export default function RunView(props: RunViewProps) {
    return (
        <div className="page">
            <div className="pageSectionTop">
                RunView
            </div>
            <div className="pageSectionContent">
                Run
            </div>
            <div className="pageSectionButton">
                <Link to="/">Play</Link> | <Link to="/plan">Plan</Link> | <Link to="/run">Run</Link>
            </div>
        </div>
    );    
}