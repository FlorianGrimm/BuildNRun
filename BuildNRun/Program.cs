using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;


using Orleans;
using Orleans.Configuration;
using Orleans.Hosting;
using Orleans.Providers;
using Orleans.Serialization;
using Orleans.Reminders.AzureStorage;
using Orleans.Runtime.ReminderService;

namespace BuildNRun {
    public class Program {
        public static void Main(string[] args) {
            CreateHostBuilder(args).Build().Run();
        }

        private static void ConfigureSilo(Microsoft.Extensions.Hosting.HostBuilderContext hostBuilderContext, ISiloBuilder siloBuilder) {
            //
            var orleansOptions = new OrleansOptions();
            hostBuilderContext.Configuration.GetSection("Orleans").Bind(orleansOptions);
            siloBuilder
                .UseLocalhostClustering(serviceId: Constants.ServiceId, clusterId: Constants.ServiceId)
                .AddAzureTableGrainStorage(Constants.Store, (options) => {
                    options.UseJson = true;
                    options.ConnectionString = orleansOptions.DataConnectionString;
                })
                .ConfigureApplicationParts((parts) => {
                    parts.AddApplicationPart(typeof(BuildNRun.Model.AccountGrain).Assembly).WithReferences();
                })
                //.UseAzureTableReminderService(options => {
                //    options.ConnectionString = orleansOptions.DataConnectionString;
                //})
                //.UseInMemoryReminderService()
                ;
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseOrleans(ConfigureSilo)
                .ConfigureWebHostDefaults(webBuilder => {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
