namespace BuildNRun.Services {
    public class JwtBearerOptions {
        public JwtBearerOptions()
        {
            this.JwtBearerKey=string.Empty;
        }
        public string JwtBearerKey { get; set; }
    }
}
