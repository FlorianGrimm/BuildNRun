using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;

namespace BuildNRun.Service {
    public class CookieConsentService {
        public static (bool showBanner, string? consentCookie, string? userName) GetCookieShowBanner(HttpContext httpContext) {
            var consentFeature = httpContext.Features.Get<ITrackingConsentFeature>();
            var userName = ((httpContext?.User?.Identity is System.Security.Principal.IIdentity id) && (id.IsAuthenticated)) ? id.Name : null;

            if (consentFeature is null) {
                return (false, null, userName);
            } else if (consentFeature.CanTrack) {
                return (false, null, userName);
            } else if (userName is object) {
                consentFeature.GrantConsent();
                return (false, null, userName);
            } else {
                return (true, consentFeature.CreateConsentCookie(), userName);
            }
        }
    }
}
