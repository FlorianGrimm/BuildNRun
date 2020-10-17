using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace BuildNRun.Service {
    public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions> {
        public TestAuthHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock)
            : base(options, logger, encoder, clock) { }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync() {
            ClaimsPrincipal testUser = new ClaimsPrincipal(new System.Security.Principal.GenericIdentity("TestUser"));
            var ticket = new AuthenticationTicket(testUser, "Test");
            var result = AuthenticateResult.Success(ticket);
            return Task.FromResult(result);
        }
    }
}
