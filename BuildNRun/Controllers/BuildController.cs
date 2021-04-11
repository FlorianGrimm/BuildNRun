using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using BuildNRun.Service;

using BuildNRunLibrary.Model;

using Microsoft.AspNetCore.Mvc;

namespace BuildNRun.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class BuildController : ControllerBase {
        private readonly ISimplePersistence _SimplePersistence;

        public BuildController(ISimplePersistence simplePersistence) {
            this._SimplePersistence = simplePersistence;
        }

        [HttpGet]
        public UserModel GetUserModel() {
            UserModel result = new UserModel();
            return result;
        }
    }
}
// https://localhost:44319/swagger/index.html