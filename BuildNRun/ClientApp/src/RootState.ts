import Services from './service';
import { UserModel } from './service/client';

export class UIState {
    userModel: UserModel;
    constructor(userModel: UserModel) {
        this.userModel = userModel;
        // this.baumhaus = 1;
        // this.zelt = 3.1111;
        // this.berg = 2.49444;
    }

    get baumhaus() : number {
        return this.userModel.baumhaus?.level || 0.0;
    }
    get zelt() : number {
        return this.userModel.zelt?.level || 0.0;
    }
    get berg() : number {
        return this.userModel.berg?.level || 0.0;
    }

    getBaumhausLevel() {
        const value = this.baumhaus;
        return (value >= 3) ? 3 : (value >= 2) ? 2 : 1;
    }
    getZeltLevel() {
        const value = this.userModel.zelt?.level || 0.0;
        return (value >= 3) ? 3 : (value >= 2) ? 2 : 1;
    }
    getBergLevel() {
        const value = this.userModel.berg?.level || 0.0;
        return (value >= 3) ? 3 : (value >= 2) ? 2 : 1;
    }
}

export class GlobalState {
    services: Services;
    uiState: UIState;
    userModel: UserModel;
    constructor(services: Services) {
        this.services = services;
        this.userModel = new UserModel();
        this.uiState = new UIState(this.userModel);
    }
    setUserModel(userModel: UserModel) {
        this.userModel = userModel;
        this.uiState.userModel = userModel;
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