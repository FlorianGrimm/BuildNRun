import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    useHistory
} from "react-router-dom";
import AbstimmungView from "./Abstimmung";
import AktionView from "./AktionView";
import HomeView from "./HomeView";
import PlanView from "./PlanView";
import RootState from "./RootState";
import RunView from "./RunView";

export interface AppRouterProps {
    appRootPath:string;
    rootState: RootState;
}
// (message: string, callback: (ok: boolean) => void) => void;
export default function AppRouter(props: AppRouterProps) {
    let location = useLocation();
    let history = useHistory();
    history.listen
    console.log("location",location)
    const handleUserConfirmation=(message: string, callback: (ok: boolean) => void)=>{
        console.log("location message", message)
        callback(true);
    }
    return (
        <Router basename={props.appRootPath} getUserConfirmation={handleUserConfirmation} >
            <Switch>
                <Route exact path="/">
                    <HomeView rootState={props.rootState} />
                </Route>
                <Route path="/aktion">
                    <AktionView rootState={props.rootState} />
                </Route>
                <Route path="/abstimmung">
                    <AbstimmungView rootState={props.rootState} />
                </Route>
                <Route path="/plan">
                    <PlanView rootState={props.rootState} />
                </Route>
                <Route path="/run">
                    <RunView rootState={props.rootState} />
                </Route>
            </Switch>
        </Router>
    );
}