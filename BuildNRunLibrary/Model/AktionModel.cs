using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

/*
 
| Aktion         | Baumhaus | Höhle | Zelt |
|----------------|----------|-------|------|
| Level 1 Aktionen                         |
| Schnee         | 0        | +0.1  | -0.1 |
| Regen          | -0.1     | 0     | +0.1 |
| Sonne          | +0.1     | -0.1  | 0    |
| -              | -        | -     | -    |
| Level 2 Aktionen                         |
| Pilze          | 0        | +0.1  | +0.1 |
| Sonnenblume    | +0.1     | 0     | +0.1 |
| Frühlingswind  | +0.1     | +0.1  | 0    |
| Schimmel       | 0        | -0.1  | -0.1 |
| Holzwürmer     | -0.1     | 0     | -0.1 |
| Überschwemmung | -0.1     | -0.1  | 0    |
| -              | -        | -     | -    |
| Level 3 Aktionen                         |
| Bürgerkrieg    | -0.1     | -0.1  | -0.1 |
| Sonnenwende    | +0.1     | +0.1  | +0.1 |
| -              | -        | -     | -    |

 */

namespace BuildNRun.Model {
    [Serializable]
    public class AktionModel {
        public AktionModel() {
            this.Name = string.Empty;
        }
        
        public AktionModel(string name, int level, float baumhaus, float berg, float zelt, bool forAll) {
            this.Name = name;
            this.Level = level;
            this.Baumhaus = baumhaus;
            this.Berg = berg;
            this.Zelt = zelt;
            this.ForAll = forAll;
        }

        public string Name { get; set; }
        public int Level { get; set; }
        public float Baumhaus { get; set; }
        public float Zelt { get; set; }
        public float Berg { get; set; }
        public bool ForAll { get; set; }

        public void AddGewinner(AktionModel value) {
            if (!value.ForAll) {
                if (value.Baumhaus > 0) {
                    this.Baumhaus += value.Baumhaus;
                }
                if (value.Zelt > 0) {
                    this.Zelt += value.Zelt;
                }
                if (value.Berg > 0) {
                    this.Berg += value.Berg;
                }
            }
        }

        public void AddVerliehrer(AktionModel value) {
            if (!value.ForAll) {
                if (value.Baumhaus < 0) {
                    this.Baumhaus += value.Baumhaus;
                }
                if (value.Zelt < 0) {
                    this.Zelt += value.Zelt;
                }
                if (value.Berg < 0) {
                    this.Berg += value.Berg;
                }
            }
        }

        public void AddNichtTeilnehmer(AktionModel value) {
            if (!value.ForAll) {
                this.Baumhaus -= Math.Abs(value.Baumhaus);
                this.Zelt -= Math.Abs(value.Zelt);
                this.Berg -= Math.Abs(value.Berg);
            }
        }

        public void AddGesammtTeilnehmer(AktionModel value) {
            if (value.ForAll) {
                this.Baumhaus += value.Baumhaus;
                this.Zelt += value.Zelt;
                this.Berg += value.Berg;
            }
        }
    }

    [Serializable]
    public class AktionenModel {
        private static AktionenModel? _Aktionen;

        public static AktionenModel GetAktionen() {
            if (_Aktionen is null) {
                _Aktionen = new AktionenModel()
                    .AddAktion(
                        new AktionModel("Schnee", 1, 0f, +0.1f, -0.1f, false),
                        new AktionModel("Regen", 1, -0.1f, 0f, +0.1f, false),
                        new AktionModel("Sonne", 1, +0.1f, -0.1f, 0f, false),
                        new AktionModel("Pilze", 2, 0f, +0.1f, +0.1f, false),
                        new AktionModel("Sonnenblume", 2, +0.1f, 0f, +0.1f, false),
                        new AktionModel("Frühlingswind", 2, +0.1f, +0.1f, 0f, false),
                        new AktionModel("Schimmel", 2, 0f, -0.1f, -0.1f, false),
                        new AktionModel("Holzwürmer", 2, -0.1f, 0f, -0.1f, false),
                        new AktionModel("Überschwemmung", 2, -0.1f, -0.1f, 0f, false),
                        new AktionModel("Bürgerkrieg", 3, -0.1f, -0.1f, -0.1f, true),
                        new AktionModel("Sonnenwende", 3, +0.1f, +0.1f, +0.1f, true)
                    );
            }
            return _Aktionen;
        }

        public List<AktionModel> Aktionen { get; }

        public AktionenModel() {
            this.Aktionen = new List<AktionModel>();
        }

        public AktionenModel AddAktion(params AktionModel[] aktionModel) {
            this.Aktionen.AddRange(aktionModel);
            return this;
        }

        public AktionModel? FindAktion(string aktion)
            => this.Aktionen.FirstOrDefault(a => string.Equals(a.Name, aktion, StringComparison.Ordinal));

    }
}
