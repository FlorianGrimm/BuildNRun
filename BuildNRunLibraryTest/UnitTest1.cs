using System;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

using Xunit;
using BuildNRunLibrary.Services;

namespace BuildNRunLibraryTest {
    public class UnitTest1 {
        [Fact]
        public void Test1() {
            var configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddUserSecrets<UnitTest1>();
            IConfiguration configuration = configurationBuilder.Build();
            var services = new Microsoft.Extensions.DependencyInjection.ServiceCollection();
            services.AddOptions();
            services.AddOptions<JwtBearerOptions>().Configure(options => { configuration.Bind(options); });
            services.AddOptions<TableStorageOptions>().Configure(options => { configuration.Bind(options); });
            services.AddSingleton<ITableStorageService, TableStorageService>();
            using var serviceProvider = services.BuildServiceProvider();
            Assert.True(serviceProvider.GetRequiredService<ITableStorageService>().IsConfigurationValid());
        }
    }
}
