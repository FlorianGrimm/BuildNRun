namespace BuildNRunLibrary.Model {
    public class UserModel {
        public UserModel() {
            this.Money = 0;
            this.Baumhaus = new HouseModel();
            this.Zelt = new HouseModel();
            this.Berg = new HouseModel();
        }
        public int Money { get; set; }
        public HouseModel Baumhaus { get; set; }
        public HouseModel Zelt { get; set; }
        public HouseModel Berg { get; set; }
    }
}
