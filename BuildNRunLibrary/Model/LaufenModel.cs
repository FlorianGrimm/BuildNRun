
using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;

using System;
using System.Threading.Tasks;

namespace BuildNRun.Model {
    [Serializable]
    public class LaufenModel {
        public LaufenModel() {
            this.Vorgabe = new LaufRouteModel();
            this.Lauf = new LaufRouteModel();
        }
        public LaufRouteModel Vorgabe { get; set; }
        public LaufRouteModel Lauf { get; set; }
    }

    public interface ILaufGrain : IGrainWithGuidKey {
        Task Start();
        Task CheckPoint();
        Task Fertig();
        //Task<LaufModel> GetLauf();
        //Task SetAktion(Guid userId, string aktion);
        //Task GewinnVerteilung();
    }

    [Reentrant]
    public class LaufGrain : Grain, ILaufGrain {
        private readonly IPersistentState<LaufenModel> _Laufen;

        public LaufGrain(
            [PersistentState(Constants.TableLaufen, Constants.Store)] IPersistentState<LaufenModel> laufen
            ) {
            this._Laufen = laufen;
        }

        public async Task Start() {
            await Task.CompletedTask;
            throw new NotImplementedException();
        }
        public async Task CheckPoint() {
            await Task.CompletedTask;
            //this._Laufen.State.CheckPoint
            throw new NotImplementedException();
        }

        public async Task Fertig() {
            var state = this._Laufen.State;
            int money = 0;
            //state.Vorgabe
            //state.CheckPoint
            //state.CheckPoint.Clear();
            var userId = this.GetPrimaryKey();
            var userGrain=this.GrainFactory.GetGrain<IUserGrain>(userId);
            await userGrain.AddMoney(money);
            throw new NotImplementedException();
        }

    }
}