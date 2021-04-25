using System;
using System.Collections.Generic;
using System.Text;

namespace BuildNRun.Model {
    [Serializable]
    public class HouseModel {
        public HouseModel() {
            this.Level = 1f;
        }
        public float Level { get; set; }
        public void Add(float value, bool allowNegativ) {
            if (!allowNegativ && value < 0){
                return;
            }
            this.Level = Math.Max(1f, this.Level + value);
        }
    }
}
