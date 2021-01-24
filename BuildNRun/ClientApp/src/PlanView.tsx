/// <reference path="../node_modules/bingmaps/types/MicrosoftMaps/Microsoft.Maps.All.d.ts" />

import React, { Component, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import RootState from './RootState';
import {
    Link
} from "react-router-dom";
import GeoLocationService from './service/GeoLocationService';
import MapRoute from './service/MapRoute';
import { useReduceAsync } from './useUtilities';
import { GeoCoordinates, GeoPosition } from './types';
//import BingMapsService from './service/BingMapsService';
//import {useOnce} from './useUtilities';

export interface PlanViewProps {
    rootState: RootState;
}

type InitialState = {
    mapCtrlLoaded: boolean;
    mapRoute: MapRoute | null;
    geoLocation: GeoPosition;
};
function getInitialState(): InitialState {
    return {
        mapCtrlLoaded: false,
        mapRoute: null,
        geoLocation: GeoLocationService.getPosition00()
    };
}
;
type State = {
    mapCtrlLoaded: boolean;
    mapRoute: MapRoute | null;
    geoLocation: GeoCoordinates | null;
};

type Action =
    { type: 'NewRoute' }
    | { type: 'DeleteRoute' }
    | { type: "mapCtrlLoaded" }
    | { type: "mapRoute", mapRoute: MapRoute }
    | { type: "setGeoLocation", geoLocation: GeoCoordinates }
    ;
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "NewRoute":
            return state;
        case "DeleteRoute":
            return state;
        case "mapCtrlLoaded":
            return { ...state, mapCtrlLoaded: true };
        case "mapRoute":
            return { ...state, mapRoute: action.mapRoute };
        case "setGeoLocation":
            return { ...state, geoLocation: action.geoLocation };
    }
    return state;
}

type ActionAsync =
    { type: "viewchange", mapRoute: MapRoute }
    | { type: "loadMapControl"}
    | { type: "getCurrentPosition"}
    ;

function handleActionAsync(
    action: ActionAsync,
    { rootState, dispatch }: { rootState: RootState, dispatch: (value: Action) => void }
) {
    if (action.type === "viewchange") {
        //
        const location = action.mapRoute.map.getCenter();
        dispatch({type:"setGeoLocation", geoLocation:location})
        //
        return;
    }
    if (action.type === "loadMapControl"){
        return rootState.getServices().bingMapsService.loadMapControlAsync(true).then(() => {
            dispatch({ type: "mapCtrlLoaded" })
        });
    }
    if (action.type === "getCurrentPosition"){
        rootState.getServices().geoLocationService.getCurrentPositionAsync().then(
            (geoLocation) => {
                console.log("setGeoLocation", geoLocation);
                dispatch({ type: "setGeoLocation", geoLocation: geoLocation.coords });
            },
            (reason) => {
                // TODO                
            });
        return;
    }
    return;
}

export default function PlanView(props: PlanViewProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [state, dispatch] = useReducer(reducer, {
        mapCtrlLoaded: false,
        mapRoute: null,
        geoLocation: null
    });
    const [isProcessing, pushAction] = useReduceAsync<ActionAsync>(
        handleActionAsync,
        () => ({ rootState: props.rootState, dispatch: dispatch }),
        () => [{type:"loadMapControl"}, {type:"getCurrentPosition"}]
        );
/*
    useEffect(
        () => {
            if (mapRef.current && state.mapCtrlLoaded) {
                // if (state.mapRoute) {
                //     return () => {
                //         state.mapRoute?.dispose();
                //     };
                // } else {

                const bingMapsService = props.rootState.getServices().bingMapsService;
                const mapConfig = bingMapsService.getMapConfig();
                const coords = state.geoLocation;
                if (coords && coords.latitude && coords.longitude) {
                    var center = new Microsoft.Maps.Location(coords.latitude, coords.longitude);
                    mapConfig.center = center
                }
                mapConfig.showScalebar = true;
                mapConfig.showLocateMeButton = true;
                mapConfig.mapTypeId = Microsoft.Maps.MapTypeId.aerial;
                mapConfig.zoom = 14

                console.log("new Microsoft.Maps.Map");
                const mapRoute = bingMapsService.createMap(mapRef.current, mapConfig);
                Microsoft.Maps.Events.addHandler(mapRoute.map, 'viewchangestart', () => { pushAction({ type: 'viewchange', mapRoute: mapRoute }); });
                Microsoft.Maps.Events.addHandler(mapRoute.map, 'viewchange', () => { pushAction({ type: 'viewchange', mapRoute: mapRoute }); });
                Microsoft.Maps.Events.addHandler(mapRoute.map, 'viewchangeend', () => { pushAction({ type: 'viewchange', mapRoute: mapRoute }); });
                Microsoft.Maps.Events.addHandler(mapRoute.map, 'viewrendered', () => { pushAction({ type: 'viewchange', mapRoute: mapRoute }); });

                dispatch({ type: "mapRoute", mapRoute: mapRoute });
                return () => {
                    mapRoute.dispose();
                };
                // }
            }
        },
        [mapRef.current, state.mapCtrlLoaded]
    );
*/


    /*
    
        var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
        if (directionsManager.getAllWaypoints().length < 2) {
            directionsManager.clearAll();
            var seattleWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: 'Seattle, WA' });
            directionsManager.addWaypoint(seattleWaypoint);
            var tacomaWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: 'Tacoma, WA', location: new Microsoft.Maps.Location(47.255134, -122.441650) });
            directionsManager.addWaypoint(tacomaWaypoint);
        }
        // Insert a waypoint
        directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ address: 'Issaquah, WA', location: new Microsoft.Maps.Location(47.530094, -122.033798) }), 1);
        // Set the element in which the itinerary will be rendered
        directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('printoutPanel') });
        directionsManager.calculateDirections();
        
    */
    //onNewRoute = useCallback()
    //<button onClick={} >New Route</button>
    return (
        <div className="page">
            <div className="pageSectionTop">
                PlanView
                <Link to="/">Play</Link> | <Link to="/plan">Plan</Link> | <Link to="/run">Run</Link>
            </div>
            <div className="pageSectionContent" style={{ backgroundColor: "darkgray" }} ref={mapRef}>
                Landkarte wird geladen
            </div>
            <div className="pageSectionButton">
            </div>
        </div>
    );
}