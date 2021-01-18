using BuildNRun.Service;

using BuildNRunLibrary.Services;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;
using Microsoft.IdentityModel.Tokens;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BuildNRun {
    public class Startup {
        private bool _OnAzure;
        private IConfiguration _Configuration;

        public Startup(IConfiguration configuration) {
            this._Configuration = configuration;
            bool onAzure = false;
            string userdomain = System.Environment.GetEnvironmentVariable("USERDOMAIN") ?? string.Empty;
            if (string.Equals(userdomain, "WORKGROUP", StringComparison.Ordinal)) {
                var computername = System.Environment.GetEnvironmentVariable("COMPUTERNAME") ?? string.Empty;
                if (computername.StartsWith("RD")) {
                    onAzure = true;
                }
            }
            this._OnAzure = onAzure;
        }

        public void ConfigureServices(IServiceCollection services) {
            services.AddOptions<BingMapOptions>().Configure(options => { this._Configuration.Bind(options); });
            services.AddOptions<TableStorageOptions>().Configure(options => { this._Configuration.Bind(options); });
            services.AddSingleton<ITableStorageService, TableStorageService>();
            /*
            services.AddHttpContextAccessor();
            services.AddScoped<CurrentUserService>();
            */

            //services.AddSession(options =>
            //{
            //    options.Cookie.SameSite = SameSiteMode.Unspecified;
            //    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            //    options.Cookie.IsEssential = true;
            //});

            services.Configure<CookiePolicyOptions>(options => {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.Unspecified;
                //options.OnAppendCookie = cookieContext =>
                //    CheckSameSite(cookieContext.Context, cookieContext.CookieOptions);
                //options.OnDeleteCookie = cookieContext =>
                //    CheckSameSite(cookieContext.Context, cookieContext.CookieOptions);
            });

            if (this._OnAzure) {
                services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
                    .AddMicrosoftIdentityWebApp(_Configuration.GetSection("AzureAd"));
            } else {
                services.AddAuthentication("Test")
                    .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", options => { });
            }

            services.AddAuthorization(options => {
                // By default, all incoming requests will be authorized according to the default policy
                options.FallbackPolicy = options.DefaultPolicy;
            });
            services.AddMvcCore().AddApiExplorer();
            services.AddRazorPages(options => {
                options.Conventions.AddPageRoute("/App", "/App/{**args}");
                options.Conventions.AddPageRoute("/AppOffline", "/AppOffline/{**args}");
                options.Conventions.AddPageRoute("/Manifest", "/manifest.webmanifest");
            })
                //.AddMicrosoftIdentityUI()
                ;
            services.AddSwaggerDocument();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            } else {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCookiePolicy();

            app.UseEndpoints(endpoints => {
                endpoints.MapRazorPages();
                endpoints.MapControllers();
            });

            app.UseOpenApi();
            app.UseSwaggerUi3();
        }
    }
}
