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
import { GeoLocation, LaufRouteModel, RoutenModel } from './service/client';
import BingMapsService from './service/BingMapsService';
//import BingMapsService from './service/BingMapsService';
//import {useOnce} from './useUtilities';

export interface PlanViewProps {
    rootState: RootState;
}

enum LoadingState {
    Init,
    Loading,
    LibraryLoaded,
    WaitingForModel,
    Running,
    Done
}

function newRoute(center: Microsoft.Maps.Location, directionsManager: Microsoft.Maps.Directions.DirectionsManager) {
    directionsManager.clearAll();
    var waypoint1 = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(center.latitude, center.longitude) });
    directionsManager.addWaypoint(waypoint1);
    var waypoint2 = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(center.latitude, center.longitude + 0.002) });
    directionsManager.addWaypoint(waypoint2);
    var waypoint3 = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(center.latitude + 0.002, center.longitude + 0.002) });
    directionsManager.addWaypoint(waypoint3);
    var waypoint4 = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(center.latitude + 0.002, center.longitude) });
    directionsManager.addWaypoint(waypoint4);
    var waypoint5 = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(center.latitude + 0.0001, center.longitude + 0.0001) });
    directionsManager.addWaypoint(waypoint5);
    directionsManager.setRenderOptions({
        firstWaypointPushpinOptions: { draggable: true },
        lastWaypointPushpinOptions: { draggable: true },
        waypointPushpinOptions: { draggable: true }
    })
    directionsManager.setRequestOptions({ routeDraggable: true, routeMode: Microsoft.Maps.Directions.RouteMode.walking });
    directionsManager.calculateDirections();
}
function loadRoute(arrLocation: GeoLocation[], directionsManager: Microsoft.Maps.Directions.DirectionsManager) {
    directionsManager.clearAll();
    for (let idx = 0; idx < arrLocation.length; idx++) {
        const getLocation = arrLocation[idx];
        var waypoint = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(getLocation.latitude, getLocation.longitude) });
        directionsManager.addWaypoint(waypoint);
    }
    directionsManager.setRenderOptions({
        firstWaypointPushpinOptions: { draggable: true },
        lastWaypointPushpinOptions: { draggable: true },
        waypointPushpinOptions: { draggable: true }
    })
    directionsManager.setRequestOptions({ routeDraggable: true, routeMode: Microsoft.Maps.Directions.RouteMode.walking });
    directionsManager.calculateDirections();
}
function saveRoute(directionsManager: Microsoft.Maps.Directions.DirectionsManager): GeoLocation[] {
    var arrLocation: GeoLocation[] = [];
    const allWaypoints = directionsManager.getAllWaypoints();

    for (let idx = 0; idx < allWaypoints.length; idx++) {
        const waypoint = allWaypoints[idx];
        const location = waypoint.getLocation();
        arrLocation.push(new GeoLocation({ latitude: location.latitude, longitude: location.longitude }));
    }

    return arrLocation;
}


export default function PlanView(props: PlanViewProps) {
    const isMountedRef = useRef<number>(0);

    //const mapRef = useRef<HTMLDivElement>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Init);
    const [mapRouteState, setMapRoute] = useState<MapRoute>();
    const [geoLocation, setGeoLocation] = useState<GeoCoordinates>();
    const [model, setModel] = useState<RoutenModel>();
    const [idxRoute, setIdxRoute] = useState<number>(-1);

    useEffect(() => {
        if ((isMountedRef.current === 0) && (loadingState === LoadingState.Init)) {
            console.log("load bing map");
            isMountedRef.current = 1;
            setLoadingState(LoadingState.Loading);
        }
        return () => {
            console.log("unload");
            setLoadingState(-1);
            isMountedRef.current = -1;
        };
    }, [1]);

    useEffect(() => {
        if (loadingState === LoadingState.Loading) {
            const divbingmap = window.document.getElementById("bingmap") as HTMLDivElement | null;
            if (divbingmap) {
                isMountedRef.current = 1;
                var iw = window.innerWidth - 40;
                var ih = window.innerHeight - 40;
                if (iw > 600) { iw = 600; }
                if (ih > 400) { ih = 400; }
                //divbingmap.style.visibility = "hidden";
                divbingmap.style.visibility = "visible";
                divbingmap.style.width = `${iw}px`;
                divbingmap.style.height = `${ih}px`;
            }

            props.rootState.getServices().client.getRouten().then((m) => {
                setModel(m);
                return null;
            }).then(() => {
                Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
                    setLoadingState(LoadingState.LibraryLoaded);
                    return null;
                });
            });

            props.rootState.getServices().geoLocationService.getCurrentPositionAsync().then(
                (geoLocation) => {
                    console.log("setGeoLocation", geoLocation.coords);
                    setGeoLocation(geoLocation.coords);
                    return true;
                },
                (reason) => {
                    console.log("setGeoLocation", NaN);
                    setGeoLocation({ latitude: NaN, longitude: NaN });
                    return false;
                }
            )
        }

        if (loadingState === LoadingState.LibraryLoaded) {
            const divbingmap = window.document.getElementById("bingmap") as HTMLDivElement | null;
            if (divbingmap) {

                const bingMapsService = props.rootState.getServices().bingMapsService;
                const mapConfig = bingMapsService.getMapConfig();
                if (geoLocation !== undefined) {
                    if (geoLocation.latitude && !isNaN(geoLocation.latitude)
                        && geoLocation.longitude && !isNaN(geoLocation.longitude)
                        && Microsoft && Microsoft.Maps && Microsoft.Maps.Location) {
                        var center = new Microsoft.Maps.Location(geoLocation.latitude, geoLocation.longitude);
                        mapConfig.center = center;
                    }
                }
                mapConfig.showScalebar = true;
                mapConfig.showLocateMeButton = true;
                mapConfig.mapTypeId = Microsoft.Maps.MapTypeId.aerial;
                mapConfig.zoom = 14
                console.log("new Microsoft.Maps.Map");
                const mapRoute = bingMapsService.createMap(divbingmap, mapConfig);
                // Microsoft.Maps.Events.addHandler(mapRoute.map, 'viewchangestart', () => { pushAction({ type: 'viewchange', mapRoute: mapRoute }); });
                // Microsoft.Maps.Events.addHandler(mapRoute.map, 'viewchange', () => { pushAction({ type: 'viewchange', mapRoute: mapRoute }); });
                // Microsoft.Maps.Events.addHandler(mapRoute.map, 'viewchangeend', () => { pushAction({ type: 'viewchange', mapRoute: mapRoute }); });
                // Microsoft.Maps.Events.addHandler(mapRoute.map, 'viewrendered', () => { pushAction({ type: 'viewchange', mapRoute: mapRoute }); });
                //dispatch({ type: "mapRoute", mapRoute: mapRoute });
                setMapRoute(mapRoute);
                var m: RoutenModel;
                if (model && model.routen != undefined) {
                    m = model;
                } else {
                    m = new RoutenModel({ routen: [] })
                    setModel(m);
                }
                if (m.routen!.length === 0) {
                    m.routen!.push(new LaufRouteModel());
                }


                if (m.routen && m.routen.length > 0 && m.routen[0] && m.routen[0].wayPoints) {
                    loadRoute((m.routen[0].wayPoints) || [], mapRoute.directionsManager);
                    setIdxRoute(0);
                } else {
                    loadRoute([], mapRoute.directionsManager);
                    setIdxRoute(0);
                }
                setLoadingState(LoadingState.Running);
            }
        }

        // if (loadingState === LoadingState.WaitingForModel) {
        //     if (model===undefined){
        //     }
        // }

    }, [loadingState]);

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
    //
    const handleNewRoute = () => {
        debugger;
        if (mapRouteState && mapRouteState.map && mapRouteState.directionsManager) {
            const center = mapRouteState.map.getCenter();
            const directionsManager = mapRouteState.directionsManager;
            newRoute(center, directionsManager);
        }
    };
    const handleSave = () => {
        debugger;
        if (mapRouteState && mapRouteState.map && mapRouteState.directionsManager) {
            const center = mapRouteState.map.getCenter()
            const directionsManager = mapRouteState.directionsManager;
            const allWaypoints = directionsManager.getAllWaypoints();
            const wp = allWaypoints.map((wp) => { wp.getLocation() });
            /*
                export class Location {
                    // The location north or south of the equator from +90 to -90 
                    public latitude: number;

                    // The location east or west of the prime meridian +180 to -180 
                    public longitude: number;

            */
            // for(let idx=0;idx<allWaypoints.length;idx++){
            //     allWaypoints[idx].getLocation()
            // }
            // [2].getLocation()
        }
    };
    const handleNameChanged=(evt:React.ChangeEvent<HTMLInputElement>)=>{
        if(      model && model.routen && model.routen){
            if (idxRoute < model.routen.length){
                model.routen[idxRoute].name = evt.target.value;
            }
        }
    };
    console.log("loadingState", loadingState);
    //
    return (
        <div className="page">
            <div className="pageSectionTop">
                Planung | <Link to="/">Play</Link> | <Link to="/plan">Plan</Link> | <Link to="/run">Run</Link>
            </div>
            {
                ((loadingState === 0) ? (
                    <div className="pageSectionContent" style={{
                        backgroundColor: "darkgray",
                        visibility: "visible"
                    }}>
                        <div>
                            Landkarte wird geladen
                    </div>
                    </div>
                ) : (
                    <div className="pageSectionContent" >
                        <div style={{ height: 340 }}>
                        </div>
                        <div style={{}}>
                            <table >
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>Aktion</td>
                                        <td>Wegepunkte</td>
                                        <td><button onClick={() => handleNewRoute()}>Neue Route</button></td>
                                    </tr>
                                    {
                                        model && model.routen && model.routen.map((item, idx) => {
                                            if (false) {
                                                return (
                                                    <tr key={idx}>
                                                        <td><button>Lauf</button><br />
                                                            <button>Bearbeiten</button>
                                                        </td>
                                                        <td>{item.name || ""}</td>
                                                        <td colSpan={2}>{item.wayPoints!.map((wp) => { return BingMapsService.convertDDToDMSString(wp.latitude!) + ":" + BingMapsService.convertDDToDMSString(wp.longitude!) + " " })}</td>
                                                    </tr>
                                                );
                                            }
                                            if (true) {
                                                return (
                                                    <tr key={idx}>
                                                        <td><button>Speichern</button><br />
                                                            <button>Löschen</button></td>
                                                        <td><input value={item.name} onChange={()=>handleNameChanged} /></td>
                                                        <td colSpan={2}>Wegepunkte</td>
                                                    </tr>
                                                );
                                            }
                                            return (
                                                <tr key={idx}>
                                                    <td>Name</td>
                                                    <td><button onClick={() => handleNewRoute()}>new</button></td>
                                                    <td colSpan={2}>Wegepunkte</td>
                                                </tr>
                                            );
                                        })
                                    }

                                    <tr>
                                        <td><button>Bearbeiten</button></td>
                                        <td>Name</td>
                                        <td colSpan={2}>Wegepunkte</td>
                                    </tr>
                                    <tr>
                                        <td><button>save</button></td>
                                        <td>Name</td>
                                        <td>WP</td>
                                    </tr>
                                    <tr>
                                        <td><button>run</button></td>
                                        <td>Name</td>
                                        <td>WP</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            }
            <div className="pageSectionButton">
                x
            </div>
        </div>
    );
}