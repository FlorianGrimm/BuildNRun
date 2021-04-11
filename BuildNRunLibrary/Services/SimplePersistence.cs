using Microsoft.Extensions.Options;

using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace BuildNRun.Service {
    public interface ISimplePersistence {
    }
    public class SimplePersistenceOptions {
        public SimplePersistenceOptions() {
            this.DataPath = string.Empty;
        }
        public string DataPath { get; set; }
    }

    public class SimplePersistence : ISimplePersistence {
        private SimplePersistenceOptions _Options;

        public SimplePersistence(IOptions<SimplePersistenceOptions> options) {
            this._Options = options.Value;
        }
    }
}
