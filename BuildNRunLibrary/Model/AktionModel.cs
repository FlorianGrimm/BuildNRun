using System;
using System.Collections.Generic;
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
    public class AktionModel {
        public AktionModel(string name, int level, float baumhaus, float berg, float zelt) {
            this.Name = name;
            this.Level = level;
            this.Baumhaus = baumhaus;
            this.Berg = berg;
            this.Zelt = zelt;
        }

        public string Name { get; }
        public int Level { get; }
        public float Baumhaus { get; }
        public float Berg { get; }
        public float Zelt { get; }
    }
    public class AktionenModel {
        private static AktionenModel? _Aktionen;

        public static AktionenModel GetAktionen() {
            if (_Aktionen is null) {
                _Aktionen = new AktionenModel()
                    .AddAktion(
                        new AktionModel("Schnee", 1, 0f, +0.1f, -0.1f),
                        new AktionModel("Regen", 1, -0.1f, 0f, +0.1f),
                        new AktionModel("Sonne", 1, +0.1f, -0.1f, 0f),
                        new AktionModel("Pilze", 2, 0f, +0.1f, +0.1f),
                        new AktionModel("Sonnenblume", 2, +0.1f, 0f, +0.1f),
                        new AktionModel("Frühlingswind", 2, +0.1f, +0.1f, 0f),
                        new AktionModel("Schimmel", 2, 0f, -0.1f, -0.1f),
                        new AktionModel("Holzwürmer", 2, -0.1f, 0f, -0.1f),
                        new AktionModel("Überschwemmung", 2, -0.1f, -0.1f, 0f),
                        new AktionModel("Bürgerkrieg", 3, -0.1f, -0.1f, -0.1f),
                        new AktionModel("Sonnenwende", 3, +0.1f, +0.1f, +0.1f)
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
    }
}
