using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using BuildNRun.Model;
using BuildNRun.Service;

using Microsoft.AspNetCore.Mvc;

using Orleans;

namespace BuildNRun.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class BuildController : ControllerBase {
        // private readonly ISimplePersistence _SimplePersistence;
        // public BuildController(ISimplePersistence simplePersistence) {
        //     this._SimplePersistence = simplePersistence;
        // }
        private readonly IGrainFactory _GrainFactory;

        public BuildController(IGrainFactory grainFactory) {
            this._GrainFactory = grainFactory;
        }

        [HttpGet]
        public async Task<ActionResult<UserModel>> GetUserModel() {
            var authenticatedUser = BuildNRun.Helper.UserHelper.GetAuthenticatedUser(this.User);
            if (authenticatedUser is null) {
                return new ForbidResult();
            } else {
                var accountGrain = this._GrainFactory.GetGrain<IAccountGrain>(authenticatedUser);
                var account = await accountGrain.GetAccount();
                var userGrain = this._GrainFactory.GetGrain<IUserGrain>(account.UserId);
                return await userGrain.GetUser();
            }
        }
    }
}
// https://localhost:44319/swagger/index.html