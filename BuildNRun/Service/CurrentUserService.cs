#if false
using Microsoft.AspNetCore.Http;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BuildNRun.Service {
    public class CurrentUserService {
        private readonly IHttpContextAccessor _HttpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor) {
            this._HttpContextAccessor = httpContextAccessor;
        }

        public virtual bool UserIsAuthenticated()
            => ((this._HttpContextAccessor.HttpContext?.User?.Identity is System.Security.Principal.IIdentity id) && (id.IsAuthenticated));
    }
}
#endif