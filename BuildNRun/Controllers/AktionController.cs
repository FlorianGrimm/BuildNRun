using System.Threading.Tasks;

using BuildNRun.Model;


using Microsoft.AspNetCore.Mvc;

using Orleans;
namespace BuildNRun.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class AktionController : ControllerBase {
        private readonly IGrainFactory _GrainFactory;

        public AktionController(IGrainFactory grainFactory) {
            this._GrainFactory = grainFactory;
        }

        [HttpGet("/GetAktionenList", Name = "GetAktionenList")]
        public Task<ActionResult<AktionenModel>> GetAktionenList() {
            return Task.FromResult<ActionResult<AktionenModel>>(AktionenModel.GetAktionen());
        }

        
    }
}
// https://localhost:44319/swagger/index.html