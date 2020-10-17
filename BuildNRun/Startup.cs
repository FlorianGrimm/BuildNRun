using BuildNRun.Service;

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
        private bool onAzure;

        public Startup(IConfiguration configuration) {
            Configuration = configuration;
            bool onAzure = false;
            if(string.Equals(System.Environment.GetEnvironmentVariable("USERDOMAIN"), "WORKGROUP", StringComparison.Ordinal)) {
                var computername = System.Environment.GetEnvironmentVariable("COMPUTERNAME"); // COMPUTERNAME=RD501AC552AFB6
                var username = System.Environment.GetEnvironmentVariable("USERNAME"); // USERNAME=RD501AC552AFB6$
                if(string.Equals(computername, (username + "$"), StringComparison.Ordinal)) {
                    onAzure = true;
                }
            }
            this.onAzure = onAzure;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {

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

            if(this.onAzure) {
                services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
                    .AddMicrosoftIdentityWebApp(Configuration.GetSection("AzureAd"));
            } else {
                services.AddAuthentication("Test")
                       .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                           "Test", options => { });
            }

            services.AddAuthorization(options => {
                // By default, all incoming requests will be authorized according to the default policy
                options.FallbackPolicy = options.DefaultPolicy;
            });
            services.AddRazorPages(options=> {
                options.Conventions.AddPageRoute("/App", "/App/{**args}");
                options.Conventions.AddPageRoute("/Manifest", "/manifest.webmanifest");
                })
                .AddMvcOptions(options => { })
                .AddMicrosoftIdentityUI();

            //services.AddSwaggerDocument();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
            if(env.IsDevelopment()) {
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

            //app.UseOpenApi();
            //app.UseSwaggerUi3();

            app.UseEndpoints(endpoints => {
                endpoints.MapRazorPages();
                endpoints.MapControllers();
            });
        }
    }
}
