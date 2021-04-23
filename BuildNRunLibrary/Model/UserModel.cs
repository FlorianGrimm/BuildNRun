using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;

using System;
using System.Threading.Tasks;

namespace BuildNRun.Model {
    public class UserModel {
        public UserModel() {
            this.Money = 0;
            this.Baumhaus = new HouseModel();
            this.Zelt = new HouseModel();
            this.Berg = new HouseModel();
        }

        public string Name { get; set; }
        public int Money { get; set; }
        public HouseModel Baumhaus { get; set; }
        public HouseModel Zelt { get; set; }
        public HouseModel Berg { get; set; }

    }

    public interface IUserGrain : IGrainWithGuidKey {
        Task<UserModel> GetUser();
        Task SetName(string name);
        Task AddMoney(int money);
    }

    [Reentrant]
    public class UserGrain : Grain, IUserGrain {
        private readonly IPersistentState<UserModel> _User;

        public UserGrain(
            [PersistentState(Constants.TableUser, Constants.Store)] IPersistentState<UserModel> user
            ) {
            this._User = user;
        }

        public async Task<UserModel> GetUser() {
            if (!this._User.RecordExists) {
                this.InitializeUser();
                await this._User.WriteStateAsync();
            }
            return this._User.State;
        }

        private void InitializeUser() {
            UserModel state = this._User.State;
            state.Money = 5;
            state.Baumhaus.Level = 1;
            state.Berg.Level = 1;
            state.Zelt.Level = 1;
        }

        public async Task SetName(string name) {
            this._User.State.Name = name;
            await this._User.WriteStateAsync();
        }

        public async Task AddMoney(int money) {
            this._User.State.Money += money;
            await this._User.WriteStateAsync();
        }
    }
}
