var positionWatcher = 0;

export default class GeoLocationService {
    currentSuccessCallback: PositionCallback | null;
    currentErrorCallback: PositionErrorCallback | null;
    currentPosition: GeolocationPosition | null;

    constructor() {
        this.currentSuccessCallback = null;
        this.currentErrorCallback = null;
        this.currentPosition = null;
    }

    private watchPositionSuccessCallback = (position: GeolocationPosition) => {
        this.currentPosition = position;
        if (this.currentSuccessCallback !== null) {
            this.currentSuccessCallback(position);
        }
    };

    private watchPositionErrorCallback = (positionError: GeolocationPositionError) => {
        if (this.currentErrorCallback !== null) {
            this.currentErrorCallback(positionError);
        }
    };

    getCurrentPositionAsync(): Promise<GeolocationPosition> {
        if (navigator.geolocation) {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: 1000 * 60, timeout: 1000 * 60 * 2 });
            });
        } else {
            return Promise.reject({
                code: 2,
                message: "POSITION_UNAVAILABLE"
            });
        }
    }
    static getPosition00():GeolocationPosition{
        return {
            coords:{
                accuracy:0,
                altitude:null,
                altitudeAccuracy:null,
                heading:null,
                latitude:0,
                longitude:0,
                speed:null
            },
            timestamp:0
        };
    }
 
    watchPosition(successCallback: PositionCallback, errorCallback?: PositionErrorCallback, options?: PositionOptions) {
        this.currentSuccessCallback = successCallback || null;
        this.currentErrorCallback = errorCallback || null;
        if (navigator.geolocation) {
            if (positionWatcher === 0) {
                positionWatcher = navigator.geolocation.watchPosition(this.watchPositionSuccessCallback, this.watchPositionErrorCallback, options);
            }
            return true;
        } else {
            return false;
        }
    }

    clearWatch() {
        if (navigator.geolocation) {
            if (positionWatcher !== 0) {
                navigator.geolocation.clearWatch(positionWatcher);
                positionWatcher = 0;
            }
        }
    }
}