using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using BuildNRun.Service;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;

namespace BuildNRun.Pages {
    // [Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute()]
    public class AppModel : PageModel {
        public string BingMapUrl { get; set; }
        public AppModel(IOptions<BingMapOptions> options) {
            this.BingMapUrl = options.Value.BingMapUrl;
        }
        //public bool UserIsAuthenticated;
        //private readonly CurrentUserService _CurrentUserService;
        //public AppModel(CurrentUserService currentUserService) {
        //    this._CurrentUserService = currentUserService;
        //}
        public void OnGet() {
            //this.UserIsAuthenticated = this._CurrentUserService.UserIsAuthenticated();
        }
    }
}
