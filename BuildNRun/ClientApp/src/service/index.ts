import GeoLocationService from './GeoLocationService'
import BingMapsService from './BingMapsService'
import { AppRootConfig } from '../AppRootConfig';
import {Client} from './client';
export default class Services {
    geoLocationService: GeoLocationService
    bingMapsService: BingMapsService;
    client:Client;
    constructor(appRootConfig: AppRootConfig) {
        this.geoLocationService = new GeoLocationService();
        this.bingMapsService = new BingMapsService(appRootConfig);
        this.client = new   Client(appRootConfig.baseUrl);
    }
}