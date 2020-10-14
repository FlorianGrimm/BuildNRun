using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BuildNRun.Service {
    public class CookieConsentService {
        public static (bool showBanner, string? consentCookie) GetCookieShowBanner(HttpContext httpContext) {
            var consentFeature = httpContext.Features.Get<ITrackingConsentFeature>();
            if (consentFeature is null) {
                return (false, null);
            } else {
                if (consentFeature.CanTrack) {
                    return (false, null);
                } else { 
                    var consentCookie = consentFeature.CreateConsentCookie();
                    return (true, consentCookie);
                }
            }
        }
    }
}
