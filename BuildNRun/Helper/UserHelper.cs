using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BuildNRun.Helper {
    public static class UserHelper {
        public static string? GetAuthenticatedUser(ClaimsPrincipal? user) {
            if (user is null) { return null; }
            var identity = user.Identity;
            if (identity is null) { return null; }
            if (!identity.IsAuthenticated) { return null; }
            return identity.Name;
        }
    }
}
