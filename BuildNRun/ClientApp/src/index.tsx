import React from 'react';
import ReactDOM from 'react-dom';
import registerSW from './registerServiceWorker';
import App from './App';
import RootState from './RootState';
import Services from './service'
import { getAppRootConfig, AppRootConfig } from './AppRootConfig';

const appRootConfig : (AppRootConfig|null) = getAppRootConfig();
const rootElement = document.getElementById('root');
if (rootElement && appRootConfig) {
    const services = new Services(appRootConfig);
    const rootState = new RootState(services);
    const appRootPath = window.location.pathname.toLowerCase().startsWith("/appoffline") ? "/AppOffline" : "/App";
    ReactDOM.render(
        (
            <App rootState={rootState} appRootPath={appRootPath}></App>
        ),
        rootElement);
    if (window === undefined) registerSW();
} else {
    if (!rootElement) {console.error("rootElement is null.");}
    if (!appRootConfig) {console.error("appRootConfig is null.");}
}
