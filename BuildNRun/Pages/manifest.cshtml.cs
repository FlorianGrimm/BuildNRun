using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BuildNRun.Pages {
    public class ManifestModel : PageModel
    {
        public string SchemeHost { get; set; } = "";
        public void OnGet()
        {
            this.SchemeHost = $"{this.Request.Scheme}://{this.Request.Host}";
        }
    }
}
