using Microsoft.Extensions.Options;

using System;
using System.Collections.Generic;
using System.Text;

namespace BuildNRun.Services {
    public class TableStorageService : ITableStorageService {
        private readonly TableStorageOptions _Options;

        public TableStorageService(IOptions<TableStorageOptions> options) :this(options.Value) {
            
        }

        public TableStorageService(TableStorageOptions options) {
            this._Options = options;
        }

        public bool IsConfigurationValid() {
            return true;
        }
    }
}
