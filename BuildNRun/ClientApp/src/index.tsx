import React from 'react';
import ReactDOM from 'react-dom';
import registerSW from './registerServiceWorker';
import App from './App';
import RootState from './RootState';
import Services from './service'
const bingMapUrl = ((window as any).bingMapUrl as string) ?? "";
const rootElement = document.getElementById('root');
if (rootElement) {
    const services = new Services(bingMapUrl);
    const rootState = new RootState(services);
    const appRootPath = window.location.pathname.toLowerCase().startsWith("/appoffline") ? "/AppOffline" : "/App";
    ReactDOM.render(
        (
            <App rootState={rootState} appRootPath={appRootPath}></App>
        ),
        rootElement);
    if (window === undefined) registerSW();
}
