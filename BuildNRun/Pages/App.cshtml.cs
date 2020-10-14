using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using BuildNRun.Service;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BuildNRun.Pages {
    //[Microsoft.AspNetCore.Authorization.Authorize(AuthenticationSchemes = "EasyAuth")]
    public class AppModel : PageModel {
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
