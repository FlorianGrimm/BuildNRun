import Services from './service'
export class GlobalState{
    services: Services;

    constructor(services:Services){
        this.services = services;
    }
}
var _GlobalState:GlobalState;
export default class RootState {
    constructor(services:Services){
        _GlobalState=new GlobalState(services);
    }
    getGlobalState() { return _GlobalState; }
    getServices() { return _GlobalState.services; }
}