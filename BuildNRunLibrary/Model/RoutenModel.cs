using Orleans;
using Orleans.Runtime;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BuildNRun.Model {
    [Serializable]
    public class RoutenModel {
        public RoutenModel() {
            this.Routen = new List<LaufRouteModel>();
        }

        public List<LaufRouteModel> Routen { get; }
    }

    [Serializable]
    public class LaufRouteModel {
        public LaufRouteModel() {
            this.Id = 0;
            this.Name = string.Empty;
            this.WayPoints = new List<GeoLocation>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public List<GeoLocation> WayPoints { get; }
    }

    [Serializable]
    public class GeoLocation {
        public GeoLocation() {
        }
        public GeoLocation(double latitude, double longitude) {
            this.Latitude = latitude;
            this.Longitude = longitude;
        }

        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public interface IRoutenGrain : IGrainWithGuidKey {
        Task<RoutenModel> GetRouten();
        Task SetRouten(RoutenModel value);
    }

    public class RoutenGrain: Grain, IRoutenGrain {
        private readonly IPersistentState<RoutenModel> _Routen;

        public RoutenGrain(
            [PersistentState(Constants.TableRouten, Constants.Store)] IPersistentState<RoutenModel> routen
            ) {
            this._Routen = routen;
        }

        public async Task<RoutenModel> GetRouten() {
            if (!this._Routen.RecordExists) {
                //this._Routen.State.Routen.Add(new LaufRouteModel());
                await this._Routen.WriteStateAsync();
            }
            return this._Routen.State;
        }
        public async Task SetRouten(RoutenModel value) {
            if (!this._Routen.RecordExists) {
                this._Routen.State.Routen.Clear();
                this._Routen.State.Routen.AddRange(value.Routen);
                await this._Routen.WriteStateAsync();
            }
        }
    }
}

