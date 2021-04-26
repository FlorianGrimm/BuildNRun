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

        [HttpGet("/GetCurrentUser", Name = "GetCurrentUser")]
        public async Task<ActionResult<UserModel>> GetCurrentUser() {
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

        [HttpGet("/Abstimmung", Name = "GetAbstimmung")]
        public async Task<ActionResult<EigeneAbstimmungenModel>> GetAbstimmung() {
            var authenticatedUser = BuildNRun.Helper.UserHelper.GetAuthenticatedUser(this.User);
            if (authenticatedUser is null) {
                return new ForbidResult();
            } else {
                var accountGrain = this._GrainFactory.GetGrain<IAccountGrain>(authenticatedUser);
                var account = await accountGrain.GetAccount();
                var abstimmungGrain = this._GrainFactory.GetGrain<IAbstimmungGrain>(0);
                return await abstimmungGrain.GetAbstimmung(account.UserId);
            }
        }

        [HttpPost("/Abstimmung", Name = "SetAbstimmung")]
        public async Task<ActionResult<EigeneAbstimmungenModel>> SetAbstimmung([FromBody]string aktion) {
            var authenticatedUser = BuildNRun.Helper.UserHelper.GetAuthenticatedUser(this.User);
            if (authenticatedUser is null) {
                return new ForbidResult();
            } else {
                var accountGrain = this._GrainFactory.GetGrain<IAccountGrain>(authenticatedUser);
                var account = await accountGrain.GetAccount();
                var abstimmungGrain = this._GrainFactory.GetGrain<IAbstimmungGrain>(0);
                await abstimmungGrain.SetAktion(account.UserId, aktion);
                return await abstimmungGrain.GetAbstimmung(account.UserId);
            }
        }

        [HttpPost("/KaufAktion", Name = "KaufAktion")]
        public async Task<ActionResult<UserModel>> KaufAktion([FromBody] string aktion) {
            var authenticatedUser = BuildNRun.Helper.UserHelper.GetAuthenticatedUser(this.User);
            if (authenticatedUser is null) {
                return new ForbidResult();
            } else {
                var accountGrain = this._GrainFactory.GetGrain<IAccountGrain>(authenticatedUser);
                var account = await accountGrain.GetAccount();
                var userGrain = this._GrainFactory.GetGrain<IUserGrain>(account.UserId);
                await userGrain.KaufAktion(account.UserId, aktion);
                return await userGrain.GetUser();
            }
        }

        [HttpGet("/Routen", Name = "GetRouten")]
        public async Task<ActionResult<RoutenModel>> GetRouten() {
            var authenticatedUser = BuildNRun.Helper.UserHelper.GetAuthenticatedUser(this.User);
            if (authenticatedUser is null) {
                return new ForbidResult();
            } else {
                var accountGrain = this._GrainFactory.GetGrain<IAccountGrain>(authenticatedUser);
                var account = await accountGrain.GetAccount();
                var routenGrain = this._GrainFactory.GetGrain<IRoutenGrain>(account.UserId);
                return await routenGrain.GetRouten();
            }
        }

        [HttpPost("/Routen", Name = "SetRouten")]
        public async Task<ActionResult> SetRouten([FromBody]RoutenModel value) {
            var authenticatedUser = BuildNRun.Helper.UserHelper.GetAuthenticatedUser(this.User);
            if (authenticatedUser is null) {
                return new ForbidResult();
            } else {
                var accountGrain = this._GrainFactory.GetGrain<IAccountGrain>(authenticatedUser);
                var account = await accountGrain.GetAccount();
                var routenGrain = this._GrainFactory.GetGrain<IRoutenGrain>(account.UserId);
                await routenGrain.SetRouten(value);
                return new OkResult();
            }
        }
    }
}
// https://localhost:44319/swagger/index.html