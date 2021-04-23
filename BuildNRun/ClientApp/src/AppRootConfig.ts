export type AppRootConfig = {
    bingMapUrl: string;
    bingMapCredentials: string;
    baseUrl:string;
}

export function getAppRootConfig(): (AppRootConfig | null) {
    if ((window as any).getBuildNRunConfig) {
        var result = (((window as any).getBuildNRunConfig()) || null) as (AppRootConfig | null);
        if (result != null){
            result.baseUrl = window.location.href.substr(0, window.location.href.substr(10).indexOf('/')+10);
        }
        return result;
    }
    return null;
}