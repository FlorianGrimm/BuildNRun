using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;

namespace BuildNRun.Pages
{
    [Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute()]
    public class AppOfflineModel : PageModel
    {
        public string BingMapUrl { get; set; }
        public string BingMapCredentials { get; set; }

        public AppOfflineModel(IOptions<BingMapOptions> options) {
            this.BingMapUrl = options.Value.BingMapUrl;
            this.BingMapCredentials = options.Value.BingMapCredentials;
        }

        public void OnGet()
        {
        }
    }
}
