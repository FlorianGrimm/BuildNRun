export type GeoCoordinates = {
    accuracy?: number | null | undefined;
    // altitude: number | null;
    // altitudeAccuracy: number | null;
    // heading: number | null;
    latitude: number;
    longitude: number;
    speed?: number | null | undefined;
    state?: number | null | undefined;
}

export type GeoPosition = {
    coords: GeolocationCoordinates;
    timestamp: number;
}

export type House = {
    timestamp: number;
}

export type RunRoute = {
    id: string;
    name: string;
    geoPositions: GeoPosition[];
    timestamp: number;
}

export type GameState = {
    house: House;
    plots: RunRoute[];
    dones: RunRoute[];
    current: RunRoute | null;
    timestamp: number;
}

