import mongoose from "mongoose";
import configs from "@/configs/";
import {Company, Dish, Menu, Token, User} from "@/models";
import {HashString} from "@/utils/md5";
import {ICompany, IStore} from "@/models/company";

export default new class Database {
  /**
   * connect
   */
  async connect() {
    const url = configs.DATABASE_URL;
    console.log("MongoDB URI:", url);

    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });

      await Company.createCollection();
      await User.createCollection();
      await Menu.createCollection();
      await Token.createCollection();
      await Dish.createCollection();

      if(await Company.countDocuments({}) === 0) {
        const company = new Company(<ICompany>{
          name: "KaiyouIT Company",
          phone: "012345678",
          email: "suport@kaiyouit.com",
          representative_name: "Nguyen Huy Hung",
          post_code: "320000",
          address: "4/82 Dich Vong Hau Street - Hanoi - Vietnam",
          url: "http://kaiyouit.com",
          stores: [<IStore>{
            name: "Store Hanoi",
            max_users: 3,
            post_code: "320000",
            units: [
              "勺",
              "合",
              "升",
              "斗",
              "cc",
              "ml",
              "l",
              "cup",
              "g",
              "kg",
            ],
            representative_name: "",
            prefecture: "Hanoi",
            address: "82 - Dich Vong",
            users:[]
          }]
        });

        //create admin account
        await User.create({
          store_id: "",
          name: "Admin",
          email: "admin@gmail.com",
          avatar: "",
          name_kana: "Admin 12345",
          phone: "0123456789",
          company_id: "",
          password: HashString("12345"),
          role: "admin"
        });

        const manager = await User.create({
          store_id: (company.stores[0] as any)._id,
          name: "Manager 1",
          email: "support@kaiyouit.com",
          avatar: "",
          name_kana: "Manager 12345",
          phone: "0987654321",
          company_id: company._id,
          password: HashString("12345"),
          role: "manager"
        });
        const user = await User.create({
          store_id: (company.stores[0] as any)._id,
          name: "Niem TT",
          email: "niemtt@gmail.com",
          avatar: "",
          name_kana: "Niem TT",
          phone: "0395710844",
          company_id: company._id.toString(),
          password: HashString("12345"),
          role: "user"
        });
        company.stores[0].users = [manager._id, user._id];

        await company.save();
      }
    } catch (error) {
      if (error.code == 48) {
        console.log("MongoDB:", error.message);
      } else {
        console.error(error);
      }
    }
  }
}();
