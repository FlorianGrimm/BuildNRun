import GeoLocationService from './GeoLocationService'
import BingMapsService from './BingMapsService'

export default class Services {
    geoLocationService: GeoLocationService
    bingMapsService:BingMapsService;
    constructor(bingMapUrl :string) {
        this.geoLocationService = new GeoLocationService();
        this.bingMapsService = new BingMapsService(bingMapUrl);
    }

}