import Services from './service';

export class UIState {
    baumhaus: number;
    zelt: number;
    berg: number;
    constructor() {
        this.baumhaus = 1;
        this.zelt = 3.1111;
        this.berg = 2.49444;
    }
    getBaumhausLevel() {
        if (this.baumhaus >= 3) return 3;
        if (this.baumhaus >= 2) return 2;
        return 1;
    }
    getZeltLevel() {
        if (this.zelt >= 3) return 3;
        if (this.zelt >= 2) return 2;
        return 1;
    }
    getBergLevel() {
        if (this.berg >= 3) return 3;
        if (this.berg >= 2) return 2;
        return 1;
    }
}

export class GlobalState {
    services: Services;
    uiState: UIState;
    constructor(services: Services) {
        this.services = services;
        this.uiState = new UIState();
    }
}
var _GlobalState: GlobalState;
export default class RootState {
    constructor(services: Services) {
        _GlobalState = new GlobalState(services);
    }
    getGlobalState() { return _GlobalState; }
    getServices() { return _GlobalState.services; }
}