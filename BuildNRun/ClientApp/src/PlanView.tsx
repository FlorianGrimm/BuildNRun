/// <reference path="../node_modules/bingmaps/types/MicrosoftMaps/Microsoft.Maps.All.d.ts" />

import React, { Component, useEffect, useRef, useState } from 'react';
import RootState from './RootState';
import {
    Link
} from "react-router-dom";

export interface PlanViewProps {
    rootState: RootState;
}

// export interface PlanViewState { 
//     rootState : RootState;
// }

// export default class PlanView extends Component<PlanViewProps, PlanViewState> {
//     static displayName = PlanView.name;
//     mapRef: React.RefObject<HTMLDivElement>;

//     constructor(props:PlanViewProps){
//         super(props);
//         this.state = {
//             rootState: props.rootState
//         };
//         this.mapRef = createRef<HTMLDivElement>();
//     }

//     render(){
//         return (<div>
//             <div>
//                 PlanView
//             </div>
//             <ul>
//                         <li>
//                             <Link to="/">Play</Link>
//                         </li>
//                         <li>
//                             <Link to="/plan">Plan</Link>
//                         </li>
//                         <li>
//                             <Link to="/run">Run</Link>
//                         </li>
//                     </ul>
//             <div ref={this.mapRef}>
//                 Landkarte wird geladen
//             </div>
//         </div>);
//     }
// }

export default function PlanView(props: PlanViewProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [mapsLoaded, setmapsLoaded] = useState(false);
    const [mapCtrl, setMapCtrl] = useState<Microsoft.Maps.Map|null>(null);
    useEffect(() => {
        if (!mapsLoaded){
            props.rootState.getServices().bingMapsService.loadMapControlAsync().then(() => {
                setmapsLoaded(true);
            });
        }
        if (mapsLoaded && mapRef.current){
            const map = new Microsoft.Maps.Map(mapRef.current, {
                showScalebar:true,
                mapTypeId: Microsoft.Maps.MapTypeId.aerial,
                zoom: 10
            });
            setMapCtrl(map);
        }
    }, [mapRef.current, mapsLoaded]);
    return (<div className="page">
        <div className="pageSectionTop">
            PlanView
        </div>
        <div className="pageSectionContent" style={{backgroundColor:"darkgray"}} ref={mapRef}>
            Landkarte wird geladen
        </div>
        <div className="pageSectionButton">
            <Link to="/">Play</Link> | <Link to="/plan">Plan</Link> | <Link to="/run">Run</Link>
        </div>
    </div>);

}