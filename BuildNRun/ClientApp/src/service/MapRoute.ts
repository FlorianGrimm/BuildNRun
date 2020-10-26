/// <reference path="../../node_modules/bingmaps/types/MicrosoftMaps/Microsoft.Maps.All.d.ts" />

export default class MapRoute {
    static convertPositionToLocation(geoLocation: Position | null):Microsoft.Maps.Location|null {
        if (geoLocation && (geoLocation.timestamp>0)) {
            const coords = geoLocation.coords;
            if (coords.latitude && coords.altitude) {    
                // 0,0 is not a location where you can walk...            
                const location = new Microsoft.Maps.Location(geoLocation.coords.latitude, geoLocation.coords.longitude);
                return location;
            }
        }
        return null;
    }
    map: Microsoft.Maps.Map;
    directionsManager: Microsoft.Maps.Directions.DirectionsManager;
    constructor(map: Microsoft.Maps.Map, directionsManager: Microsoft.Maps.Directions.DirectionsManager) {
        this.map = map;
        this.directionsManager = directionsManager;
    }
    dispose() {
        this.directionsManager.dispose();
        this.map.dispose();
    }
}