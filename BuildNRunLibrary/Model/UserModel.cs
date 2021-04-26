using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;

using System;
using System.Linq;
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
        Task<bool> AddMoney(int money);
        Task KaufAktion(Guid userId, string aktion);
        Task GewinnVerteilung(AktionModel nichtTeilnehmerAktion);
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

        public async Task<bool> AddMoney(int money) {
            if (money < 0) {
                if (this._User.State.Money > money) {
                    return false;
                }
            }
            this._User.State.Money += money;
            await this._User.WriteStateAsync();
            return true;
        }

        public async Task KaufAktion(Guid userId, string aktion) {
            var aktionModel = AktionenModel.GetAktionen().Aktionen
                .FirstOrDefault(m => string.Equals(m.Name, aktion, StringComparison.Ordinal));
            if (aktionModel is object) {
                var userModel = this._User.State;
                if (aktionModel.Level <= userModel.Money) {
                    userModel.Money -= aktionModel.Level;

                    if (aktionModel.ForAll) {
                        userModel.Baumhaus.Add(aktionModel.Baumhaus, true);
                        userModel.Berg.Add(aktionModel.Berg, true);
                        userModel.Zelt.Add(aktionModel.Zelt, true);
                        await this._User.WriteStateAsync();
                        var abstimmungGrain = this.GrainFactory.GetGrain<IAbstimmungGrain>(0);
                        var allUserIds = await abstimmungGrain.GetUserIds();
                        foreach (var id in allUserIds) {
                            if (id == userId) {
                                continue;
                            } else {
                                var userGrain = this.GrainFactory.GetGrain<IUserGrain>(id);
                                await userGrain.GewinnVerteilung(aktionModel);
                            }
                        }

                    } else {
                        userModel.Baumhaus.Add(aktionModel.Baumhaus, false);
                        userModel.Berg.Add(aktionModel.Berg, false);
                        userModel.Zelt.Add(aktionModel.Zelt, false);
                        await this._User.WriteStateAsync();
                    }
                }
            }
        }

        public async Task GewinnVerteilung(AktionModel aktionModel) {
            var userModel = this._User.State;
            userModel.Baumhaus.Add(aktionModel.Baumhaus, true);
            userModel.Berg.Add(aktionModel.Berg, true);
            userModel.Zelt.Add(aktionModel.Zelt, true);
            await this._User.WriteStateAsync();
        }
    }
}
