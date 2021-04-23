namespace BuildNRun.Services {
    public class TableStorageOptions {
        public TableStorageOptions()
        {
            this.StorageAccount=string.Empty;
            this.StorageBaseUrl=string.Empty;
        }        
        public string StorageAccount { get; set; }
        public string StorageBaseUrl { get; set; }
    }
}
