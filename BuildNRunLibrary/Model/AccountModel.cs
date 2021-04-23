using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;

using System;
using System.Threading.Tasks;

namespace BuildNRun.Model {
    [Serializable]
    public class AccountModel {
        public Guid UserId { get; set; }
        public string Name { get; set; }
    }
    public interface IAccountGrain : IGrainWithStringKey {
        //   Task<IGameGrain> GetCurrentGame();
        //   Task JoinGame(IGameGrain game);
        //   Task LeaveGame(IGameGrain game);
        Task<AccountModel> GetAccount();
        Task SetName(string name);
    }

    [Reentrant]
    public class AccountGrain 
        : Grain
        , IAccountGrain {
        private readonly IPersistentState<AccountModel> _Account;

        public AccountGrain(
            [PersistentState(Constants.TableAccount, Constants.Store)] IPersistentState<AccountModel> account
            ){
            this._Account = account;
        }

        public async Task<AccountModel> GetAccount() {
            if (this._Account.RecordExists) {
                var userId = System.Guid.NewGuid();
                this._Account.State.UserId = userId;
                this._Account.State.Name = userId.ToString("N");
                await this._Account.WriteStateAsync();
                var userGrain = this.GrainFactory.GetGrain<IUserGrain>(userId);
                await userGrain.GetUser();
                return this._Account.State;
            } else {
                return this._Account.State;
            }
        }

        public async Task SetName(string name) {
            var userId = this._Account.State.UserId;
            this._Account.State.Name = name;
            await this._Account.WriteStateAsync();
            await this.GrainFactory.GetGrain<IUserGrain>(userId).SetName(name);
        }
    }
}
