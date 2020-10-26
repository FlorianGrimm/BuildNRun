/// <reference path="../../node_modules/bingmaps/types/MicrosoftMaps/Microsoft.Maps.All.d.ts" />

import { AppRootConfig } from '../AppRootConfig';
import MapRoute from './MapRoute';

export default class BingMapsService {
    appRootConfig: AppRootConfig;

    constructor(appRootConfig: AppRootConfig) {
        this.appRootConfig = appRootConfig;
    }

    static convertDDToDMSNumbers(dd: number) {
        var deg = dd | 0; // truncate dd to get degrees
        var frac = Math.abs(dd - deg); // get fractional part
        var min = (frac * 60) | 0; // multiply fraction by 60 and truncate
        var sec = frac * 3600 - min * 60;
        //return deg + "d " + min + "' " + sec + "\"";
        return [deg, min, sec];
    }
    static convertDDToDMSString(dd: number) {
        var deg = dd | 0; // truncate dd to get degrees
        var frac = Math.abs(dd - deg); // get fractional part
        var min = (frac * 60) | 0; // multiply fraction by 60 and truncate
        var sec = frac * 3600 - min * 60;
        return deg + "° " + min + "′ " + sec + "″";
    }
    
    loadMapControlAsync(loadDirections: boolean): Promise<boolean> {
        const w = (window as any);
        const isMapLoaded = (w.Microsoft?.Maps?.Map) ? true : false;
        const isDirectionsLoaded = (w.Microsoft?.Maps?.Directions) ? true : false;
        if (isMapLoaded && isDirectionsLoaded) {
            return Promise.resolve(true);
        } else {
            if (!isMapLoaded) {
                if (this.appRootConfig.bingMapUrl) {
                    return new Promise((resolve, reject) => {
                        (window as any).mapControlLoaded = this.mapControlLoaded.bind(this, loadDirections, resolve);
                        const scriptElement = window.document.createElement("script");
                        scriptElement.async = true;
                        scriptElement.defer = true;
                        const src = `${this.appRootConfig.bingMapUrl}&callback=mapControlLoaded`;
                        scriptElement.src = src;
                        window.document.head.appendChild(scriptElement);
                    });
                } else {
                    return Promise.reject("bingMapUrl is not set");
                }
            } else if (!isDirectionsLoaded) {
                return new Promise((resolve, reject) => {
                    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
                        console.log("Microsoft.Maps.Directions loaded");
                        resolve(true);
                    });
                });
            } else {
                return Promise.reject("cannot be");
            }
        }
    }

    mapControlLoaded(loadDirections: boolean, resolve: (result: boolean) => void) {
        console.log("mapControlLoaded")
        if (loadDirections) {
            Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
                console.log("mapControlLoaded Microsoft.Maps.Directions loaded");
                resolve(true);
            });
        } else {
            resolve(true);
        }
    }


    getMapConfig(): Microsoft.Maps.IMapLoadOptions {
        return {
            credentials: this.appRootConfig.bingMapCredentials
        };
    }

    createMap(mapEle: HTMLDivElement, mapConfig: Microsoft.Maps.IMapLoadOptions): MapRoute {
        const map = new Microsoft.Maps.Map(mapEle, mapConfig);
        const directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
        return new MapRoute(map, directionsManager);
    }
}