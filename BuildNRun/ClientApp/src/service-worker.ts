class ServiceWorkerApp {

    public static run(): void {
        addEventListener('install', ServiceWorkerApp.onInstalled);
        addEventListener('fetch', ServiceWorkerApp.onFetched);
        addEventListener('activate', ServiceWorkerApp.onActivate);
    }

    public static onInstalled = (event: any): void => {
        event.waitUntil(
            caches.open('v0.1').then((cache) => {
                return cache.addAll([
                    '/AppOffline',
                    '/app.bundle.js',
                    '/serviceworker.bundle.js',
                    '/vendor.bundle.js',
                    '/css/site.css'
                    /*
                    '/assets/images/logo.png',
                    '/assets/images/no-vessel-picture.jpg',
                    '/assets/styles/loader.css',
                    '/assets/scripts/fontawesome-pro/css/fa-svg-with-js.css',
                    '/assets/scripts/fontawesome-pro/js/fontawesome.min.js',
                    '/assets/scripts/fontawesome-pro/js/fa-light.min.js',
                    '/assets/scripts/fontawesome-pro/js/fa-regular.min.js',
                    '/assets/scripts/fontawesome-pro/js/fa-solid.min.js'
                    */
                ]);
            })
        );
    }

    public static onFetched = (event: any): void => {
        event.respondWith(
            caches.match(event.request).then((matchResponse) => {
                return matchResponse || fetch(event.request).then((fetchResponse) => {
                    return caches.open('v0.1').then((cache) => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    }
    public static onActivate = (evt: Event):void => {
        console.log("onActivate");
    }
}

ServiceWorkerApp.run();