# BuildNRun

## Auth
https://github.com/MaximRouiller/MaximeRouiller.Azure.AppService.EasyAuth
https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-how-to?WT.mc_id=easyauth-github-marouill
https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization
https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-how-to#use-multiple-sign-in-providers

## Bing Maps
https://www.bing.com/api/maps/sdkrelease/mapcontrol/isdk/loadmapasync#HTML
https://www.bingmapsportal.com/

## Template
  dotnet new webapp2 --auth MultiOrg
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "common",
    "ClientId": "11111111-1111-1111-11111111111111111",
    "CallbackPath": "/signin-oidc"
  },