"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = __importDefault(require("../configs"));
const models_1 = require("../models");
const md5_1 = require("../utils/md5");
exports.default = new class Database {
    /**
     * connect
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = configs_1.default.DATABASE_URL;
            console.log("MongoDB URI:", url);
            try {
                yield mongoose_1.default.connect(url, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                });
                yield models_1.Company.createCollection();
                yield models_1.User.createCollection();
                yield models_1.Menu.createCollection();
                yield models_1.Token.createCollection();
                yield models_1.Dish.createCollection();
                if ((yield models_1.Company.countDocuments({})) === 0) {
                    const company = new models_1.Company({
                        name: "KaiyouIT Company",
                        phone: "012345678",
                        email: "suport@kaiyouit.com",
                        representative_name: "Nguyen Huy Hung",
                        post_code: "320000",
                        address: "4/82 Dich Vong Hau Street - Hanoi - Vietnam",
                        url: "http://kaiyouit.com",
                        stores: [{
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
                                users: []
                            }]
                    });
                    //create admin account
                    yield models_1.User.create({
                        store_id: "",
                        name: "Admin",
                        email: "admin@gmail.com",
                        avatar: "",
                        name_kana: "Admin 12345",
                        phone: "0123456789",
                        company_id: "",
                        password: md5_1.HashString("12345"),
                        role: "admin"
                    });
                    const manager = yield models_1.User.create({
                        store_id: company.stores[0]._id,
                        name: "Manager 1",
                        email: "support@kaiyouit.com",
                        avatar: "",
                        name_kana: "Manager 12345",
                        phone: "0987654321",
                        company_id: company._id,
                        password: md5_1.HashString("12345"),
                        role: "manager"
                    });
                    const user = yield models_1.User.create({
                        store_id: company.stores[0]._id,
                        name: "Niem TT",
                        email: "niemtt@gmail.com",
                        avatar: "",
                        name_kana: "Niem TT",
                        phone: "0395710844",
                        company_id: company._id.toString(),
                        password: md5_1.HashString("12345"),
                        role: "user"
                    });
                    company.stores[0].users = [manager._id, user._id];
                    yield company.save();
                }
            }
            catch (error) {
                if (error.code == 48) {
                    console.log("MongoDB:", error.message);
                }
                else {
                    console.error(error);
                }
            }
        });
    }
}();
//# sourceMappingURL=database.js.map