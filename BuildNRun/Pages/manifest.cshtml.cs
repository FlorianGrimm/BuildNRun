using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BuildNRun.Pages
{
    public class ManifestModel : PageModel
    {
        public string SchemeHost { get; set; } = "";
        public void OnGet()
        {
            this.SchemeHost = $"{this.Request.Scheme}://{this.Request.Host}";
        }
    }
}
