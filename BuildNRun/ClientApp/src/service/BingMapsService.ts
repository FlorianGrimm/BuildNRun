var loadMapControlCalled : Promise<boolean> | null; 

export default class BingMapsService{
    bingMapUrl:string
    constructor(bingMapUrl:string){
        this.bingMapUrl=bingMapUrl;
    }

    loadMapControlAsync(): Promise<boolean>{
        if ((window as any).Microsoft
            && (window as any).Microsoft.Maps
            && (window as any).Microsoft.Maps.Map){
            return Promise.resolve(true);
        } else {
            return new Promise((resolve, reject) => {
                (window as any).mapControlLoaded = this.mapControlLoaded.bind(this, resolve);
                const scriptElement = window.document.createElement("script");
                scriptElement.async=true;
                scriptElement.defer=true;
                scriptElement.src=`${this.bingMapUrl}&callback=mapControlLoaded`;
                window.document.head.appendChild(scriptElement);
            });
        }
        //this.bingMapUrl
    }
    mapControlLoaded(resolve: (result:boolean)=>void){
        resolve(true);
    }
}