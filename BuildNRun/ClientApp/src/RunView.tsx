import React, { Component } from 'react';
import RootState from './RootState';
import {
    Link
} from "react-router-dom";

export interface RunViewProps { 
    rootState : RootState;
}

export interface RunViewState { 
    rootState : RootState;
}

export default class RunView extends Component<RunViewProps, RunViewState> {
    static displayName = RunView.name;
    constructor(props:RunViewProps){
        super(props);
        this.state = {
            rootState: props.rootState
        };
    }

    render() {
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
            </div>);
    }

}