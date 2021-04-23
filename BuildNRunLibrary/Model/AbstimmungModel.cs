using Orleans;
using Orleans.Concurrency;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BuildNRun.Model {
    [Serializable]
    public class AbstimmungModel {
        public AbstimmungModel() {
            this.AktionProUser = new Dictionary<Guid, string>();
        }

        public Dictionary<Guid, string> AktionProUser { get; set; }
    }

    public interface IAbstimmungGrain : IGrainWithIntegerKey {
        Task<AbstimmungModel> GetAbstimmung();
        Task SetAktion(Guid userId, string aktion);
        Task GewinnVerteilung();
    }

    [Reentrant]
    public class AbstimmungGrain : Grain, IAbstimmungGrain {
        public Task<AbstimmungModel> GetAbstimmung() {
            throw new NotImplementedException();
        }

        public Task SetAktion(Guid userId, string aktion) {
            throw new NotImplementedException();
        }

        public Task GewinnVerteilung() {
            throw new NotImplementedException();
        }
    }
}