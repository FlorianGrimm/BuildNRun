
using Orleans;

using System;
using System.Threading.Tasks;

namespace BuildNRun.Model {
    [Serializable]
    public class RoutenModel {
        public RoutenModel() {
        }
    }
    [Serializable]
    public class LaufRouteModel {
        public LaufRouteModel() {
            this.Id = 0;
            this.Name = string.Empty;
        }
        public int Id { get; set; }
        public string Name { get; set; }
    }

    //public interface IRouteGrain : IGrainWithGuidKey {
    //    Task<LaufRouteModel[]> GetRouten();
    //    Task<LaufRouteModel> SetRouten(LaufRouteModel laufRouteModel);
    //}
    //public class RouteGrain : Grain, IRouteGrain {
    //    public RouteGrain(
            
    //        ) {

    //    }
    //    public Task<LaufRouteModel[]> GetRouten() {
    //        throw new NotImplementedException();
    //    }

    //    public Task<LaufRouteModel> SetRouten(LaufRouteModel laufRouteModel) {
    //        throw new NotImplementedException();
    //    }
    //}
}
