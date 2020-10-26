export type AppRootConfig = {
    bingMapUrl: string;
    bingMapCredentials: string;
}

export function getAppRootConfig(): (AppRootConfig | null) {
    if ((window as any).getBuildNRunConfig) {
        return (((window as any).getBuildNRunConfig()) || null) as (AppRootConfig | null);
    }
    return null;
}