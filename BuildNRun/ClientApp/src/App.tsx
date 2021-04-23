import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import RootState from './RootState';
import HomeView from './HomeView';
import PlanView from './PlanView';
import RunView from './RunView';
import AktionView from './AktionView';
import AbstimmungView from './Abstimmung';

export interface AppProps {
    rootState: RootState;
    appRootPath: string;
}

export interface AppState {
    rootState: RootState;
}

export default class App extends Component<AppProps, AppState> {
    static displayName = App.name;
    constructor(props: AppProps) {
        super(props);
        this.state = {
            rootState: props.rootState
        };
    }

    render() {
        return (
            <Router basename={this.props.appRootPath}>
                <Switch>
                    <Route exact path="/">
                        <HomeView rootState={this.props.rootState} />
                    </Route>
                    <Route path="/aktion">
                        <AktionView rootState={this.props.rootState} />
                    </Route>
                    <Route path="/abstimmung">
                        <AbstimmungView rootState={this.props.rootState} />
                    </Route>
                    <Route path="/plan">
                        <PlanView rootState={this.props.rootState} />
                    </Route>
                    <Route path="/run">
                        <RunView rootState={this.props.rootState} />
                    </Route>
                </Switch>
            </Router>
        );
    }
}