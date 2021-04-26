using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;

using System;
using System.Linq;
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

    [Serializable]
    public class EigeneAbstimmungModel {
        public EigeneAbstimmungModel() {
            this.Aktion=string.Empty;
        }

        public EigeneAbstimmungModel(string aktion, int anzahl, bool eigene) {
            this.Aktion = aktion;
            this.Anzahl = anzahl;
            this.Eigene = eigene;
        }

        public string Aktion { get; set; }
        public int Anzahl { get; set; }
        public bool Eigene { get; set; }
    }

    [Serializable]
    public class EigeneAbstimmungenModel {
        public EigeneAbstimmungenModel() {
            this.EigeneAbstimmungen = new List<EigeneAbstimmungModel>();
        }

        public List<EigeneAbstimmungModel> EigeneAbstimmungen { get; }
    }

    public interface IAbstimmungGrain : IGrainWithIntegerKey {
        Task<EigeneAbstimmungenModel> GetAbstimmung(Guid userId);
        Task<bool> SetAktion(Guid userId, string aktion);
        Task GewinnVerteilung();
        Task<List<Guid>> GetUserIds();
    }

    [Reentrant]
    public class AbstimmungGrain : Grain, IAbstimmungGrain {
        private readonly IPersistentState<AbstimmungModel> _Abstimmung;
        private IDisposable? _Timer;

        public AbstimmungGrain(
                [PersistentState(Constants.TableAbstimmung, Constants.Store)] IPersistentState<AbstimmungModel> abstimmung
            ) {
            this._Abstimmung = abstimmung;
        }

        public override Task OnActivateAsync() {
            this._Timer = this.RegisterTimer(asyncCallback: HandleTick, state: null, dueTime: TimeSpan.MaxValue, period: TimeSpan.FromHours(1));
            return base.OnActivateAsync();
        }
        public override Task OnDeactivateAsync() {
            this._Timer?.Dispose();
            return base.OnDeactivateAsync();
        }
        private async Task HandleTick(object _) {
            //if (System.DateTime.UtcNow.Hour != 0) { return; }
            await this.GewinnVerteilung();
        }

        public Task<EigeneAbstimmungenModel> GetAbstimmung(Guid userId) {
            var dct = new Dictionary<string, EigeneAbstimmungModel>();
            foreach (var aktion in AktionenModel.GetAktionen().Aktionen) {
                dct.Add(aktion.Name, new EigeneAbstimmungModel(aktion.Name, 0, false));
            }
            var abstimmungen = this._Abstimmung.State.AktionProUser.Where((kv) => !string.IsNullOrEmpty(kv.Value));
            foreach (var abstimmung in abstimmungen) {
                if (dct.TryGetValue(abstimmung.Value, out var eigeneAbstimmung)) {
                    eigeneAbstimmung.Anzahl++;
                    if (abstimmung.Key == userId) {
                        eigeneAbstimmung.Eigene = true;
                    }
                }
            }

            var result = new EigeneAbstimmungenModel();
            result.EigeneAbstimmungen.AddRange(
                    dct.Values.OrderBy(eigeneAbstimmung => eigeneAbstimmung.Aktion)
                );
            return Task.FromResult<EigeneAbstimmungenModel>(result);
        }

        public async Task<bool> SetAktion(Guid userId, string aktion) {
            var erfolgreich = await this.GrainFactory.GetGrain<IUserGrain>(userId).AddMoney(-1);
            if (erfolgreich) {
                this._Abstimmung.State.AktionProUser[userId] = aktion;
                await this._Abstimmung.WriteStateAsync();
            }
            return erfolgreich;
        }

        public async Task GewinnVerteilung() {
            var aktionProUser = this._Abstimmung.State.AktionProUser;
            var aktionenDerUser = aktionProUser.Where(kv => !string.IsNullOrEmpty(kv.Value)).ToList();
            var aktionen = AktionenModel.GetAktionen();
            var count = aktionenDerUser.Count;
            if (count > 0) {
                var grpByAktion = aktionenDerUser.GroupBy(i => i.Value);
                var maxCount = grpByAktion.Max(grp => grp.Count());
                var gewinnerAktionen = grpByAktion.Where(grp => (grp.Count() == maxCount))
                    .Select(grp => grp.Key)
                    .ToDictionary(aktion => aktion, aktion => aktionen.FindAktion(aktion));
                
                var verliehrerAktion = new AktionModel(string.Empty, 0, 0f, 0f, 0f, false);
                var nichtTeilnehmerAktion = new AktionModel(string.Empty, 0, 0f, 0f, 0f, false);
                var gewinnerAktion = new AktionModel(string.Empty, 0, 0f, 0f, 0f, false);
                var gesammtAktion = new AktionModel(string.Empty, 0, 0f, 0f, 0f, false);
                foreach (var aktuelleGewinnerAktion in gewinnerAktionen.Where(kv=> (kv.Value is object) && (kv.Value.ForAll))) {
                    nichtTeilnehmerAktion.AddGesammtTeilnehmer(aktuelleGewinnerAktion.Value!);
                    verliehrerAktion.AddGesammtTeilnehmer(aktuelleGewinnerAktion.Value!);
                    gewinnerAktion.AddGesammtTeilnehmer(aktuelleGewinnerAktion.Value!);
                }
                foreach (var aktuelleGewinnerAktion in gewinnerAktionen.Where(kv => (kv.Value is object) && (!kv.Value.ForAll))) {
                    nichtTeilnehmerAktion.AddNichtTeilnehmer(aktuelleGewinnerAktion.Value!);
                    verliehrerAktion.AddVerliehrer(aktuelleGewinnerAktion.Value!);
                    gewinnerAktion.AddGewinner(aktuelleGewinnerAktion.Value!);
                }
                foreach (var kv in aktionProUser.ToList()) {
                    var userId = kv.Key;
                    IUserGrain userGrain = this.GrainFactory.GetGrain<IUserGrain>(userId);
                    if (string.IsNullOrEmpty(kv.Value)) {
                        await userGrain.GewinnVerteilung(nichtTeilnehmerAktion);
                    } else if (gewinnerAktionen.TryGetValue(kv.Value, out var aktion)) {
                        await userGrain.GewinnVerteilung(gewinnerAktion);
                    } else {
                        await userGrain.GewinnVerteilung(verliehrerAktion);
                    }
                    aktionProUser[userId] = string.Empty;
                }

                await this._Abstimmung.WriteStateAsync();
            }
        }

        public Task<List<Guid>> GetUserIds() {
            return Task.FromResult(this._Abstimmung.State.AktionProUser.Keys.ToList());
        }
    }
}