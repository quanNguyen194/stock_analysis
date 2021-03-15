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
exports.HomeController = void 0;
const api_1 = __importDefault(require("../api"));
const models_1 = require("../../models");
/**
 * home controller
 */
class HomeController extends api_1.default {
    constructor() {
        super(...arguments);
        this.checkToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.currentUser;
            let company;
            try {
                company = yield models_1.Company.findOne({
                    _id: currentUser.company_id,
                    stores: {
                        $elemMatch: {
                            _id: currentUser.store_id,
                        },
                    }
                }, {
                    name: 1,
                    phone: 1,
                    email: 1,
                    representative_name: 1,
                    post_code: 1,
                    address: 1,
                    url: 1,
                    stores: {
                        $elemMatch: {
                            _id: currentUser.store_id,
                        },
                    }
                });
                if (!company) {
                    throw "company_or_store_deleted";
                }
            }
            catch (e) {
                if (currentUser.role !== "admin") {
                    return this.responseUnprocessable(res, {
                        error: "company_or_store_deleted",
                    });
                }
            }
            if (company) {
                const store = company === null || company === void 0 ? void 0 : company.stores[0];
                const companyObj = company;
                companyObj.stores = undefined;
                return this.responseSuccess(res, {
                    data: {
                        user: currentUser,
                        company: companyObj,
                        is_preview: currentUser.is_preview,
                        store,
                    }
                });
            }
            return this.responseSuccess(res, {
                data: {
                    user: currentUser,
                }
            });
        });
        this.updateUnits = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.currentUser;
            const units = req.body.units;
            if (units) {
                yield models_1.Company.findOneAndUpdate({
                    _id: currentUser.company_id,
                    stores: {
                        $elemMatch: {
                            _id: currentUser.store_id,
                        }
                    }
                }, {
                    $set: {
                        "stores.$.units": units,
                    }
                });
                return this.responseSuccess(res, {
                    message: "update successfully"
                });
            }
            return this.responseBadRequest(res, {
                error: "units cant be null"
            });
        });
    }
}
exports.HomeController = HomeController;
//# sourceMappingURL=home.js.map