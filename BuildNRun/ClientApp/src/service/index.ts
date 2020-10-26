import GeoLocationService from './GeoLocationService'
import BingMapsService from './BingMapsService'
import { AppRootConfig } from '../AppRootConfig';

export default class Services {
    geoLocationService: GeoLocationService
    bingMapsService:BingMapsService;
    constructor(appRootConfig:AppRootConfig) {
        this.geoLocationService = new GeoLocationService();
        this.bingMapsService = new BingMapsService(appRootConfig);
    }

}