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
exports.StoreController = void 0;
const api_1 = __importDefault(require("../api"));
const models_1 = require("../../models");
const mongodb_1 = require("mongodb");
const md5_1 = require("../../utils/md5");
const mailer_1 = __importDefault(require("../../utils/mailer"));
const manager_created_1 = require("../../templates/manager_created");
const manager_updated_1 = require("../../templates/manager_updated");
/**
 * StoreController
 */
class StoreController extends api_1.default {
    constructor() {
        super(...arguments);
        this.list = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const companyId = req.params.cid;
            const companyQuery = yield models_1.Company.findOne({
                _id: companyId
            }).select("stores").populate("stores.users");
            if (!companyQuery) {
                return this.responseBadRequest(res, {
                    error: "company_not_found"
                });
            }
            const company = companyQuery.toObject();
            company.stores = company.stores.map((store) => {
                const users = (store.users.filter((user) => {
                    return user.role == "manager";
                }));
                store.users_count = store.users.length;
                store.users = undefined;
                return Object.assign(Object.assign({}, store), {
                    email: users.length ? users[0].email : "",
                    phone: users.length ? users[0].phone : "",
                    representative_name: users.length ? users[0].name : ""
                });
            });
            return this.responseSuccess(res, {
                data: {
                    stores: company.stores
                },
            });
        });
        this.detail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const companyId = req.params.cid;
            const storeId = req.params.sid;
            if (!storeId) {
                return this.responseBadRequest(res, {
                    error: "store_id_required"
                });
            }
            if (!companyId) {
                return this.responseBadRequest(res, {
                    error: "company_id_required"
                });
            }
            const company = yield models_1.Company.findOne({
                _id: companyId,
                stores: {
                    $elemMatch: {
                        _id: storeId
                    }
                }
            }, {
                stores: {
                    $elemMatch: {
                        _id: storeId
                    }
                }
            }).populate("stores.users");
            if (!company) {
                return this.responseNotFound(res, {
                    error: "company_not_found"
                });
            }
            const store = company.stores[0];
            this.responseSuccess(res, {
                message: "update_store_successfully",
                data: {
                    store,
                },
            });
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const body = req.body;
            const companyId = req.params.cid;
            const storeId = req.params.sid;
            const updateMap = {
                "stores.$.name": body.name,
                "stores.$.address": body.address,
                "stores.$.max_users": (_a = +body.max_users) !== null && _a !== void 0 ? _a : 3,
                "stores.$.post_code": body.post_code,
                "stores.$.representative_name": (_b = body.representative_name) !== null && _b !== void 0 ? _b : "",
            };
            const company = yield models_1.Company.findOneAndUpdate({
                _id: companyId,
                stores: {
                    $elemMatch: {
                        _id: storeId
                    }
                }
            }, {
                $set: updateMap
            }, {
                projection: {
                    stores: {
                        $elemMatch: {
                            _id: storeId
                        }
                    }
                },
                new: true
            });
            if (!company) {
                return this.responseBadRequest(res, {
                    error: "company_not_found"
                });
            }
            const updateUserMap = new Map();
            if (body.representative_name) {
                updateUserMap.set("name", body.representative_name);
                updateUserMap.set("name_kana", body.representative_name);
            }
            if (body.password) {
                updateUserMap.set("password", md5_1.HashString(body.password));
            }
            const checkUserFound = yield models_1.User.find({
                $or: [
                    { email: body.email },
                    { phone: body.phone }
                ]
            }).countDocuments();
            if (checkUserFound > 1) {
                return this.responseUnprocessable(res, {
                    error: "email_or_phone_already_exists"
                });
            }
            if (body.email) {
                updateUserMap.set("email", body.email);
            }
            if (body.phone) {
                updateUserMap.set("phone", body.phone);
            }
            const user = yield models_1.User.findOneAndUpdate({
                store_id: storeId,
                company_id: companyId,
                role: "manager"
            }, {
                $set: updateUserMap
            }, { new: true });
            if (user && body.password) {
                mailer_1.default.sendMail(manager_updated_1.managerUpdatedTemplate(user, body.password));
            }
            this.responseSuccess(res, {
                message: "update_store_successfully",
                data: {
                    store: company.stores[0]
                },
            });
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _c, _d, _e, _f;
            const body = req.body;
            const companyId = req.params.cid;
            const company = yield models_1.Company.findOne({
                _id: companyId
            });
            if (!company) {
                return this.responseBadRequest(res, {
                    error: "company_not_found"
                });
            }
            const userFound = yield models_1.User.findOne({
                $or: [
                    { email: body.email },
                    { phone: body.phone }
                ]
            });
            if (userFound) {
                return this.responseUnprocessable(res, {
                    error: "email_or_phone_already_exists"
                });
            }
            const storeId = new mongodb_1.ObjectID();
            const user = new models_1.User({
                store_id: storeId,
                company_id: companyId,
                name: (_c = body.representative_name) !== null && _c !== void 0 ? _c : "",
                email: body.email,
                phone: body.phone,
                password: md5_1.HashString(body.password),
                role: "manager",
                avatar: "",
                name_kana: (_d = body.representative_name) !== null && _d !== void 0 ? _d : ""
            });
            yield user.save();
            company.stores.push({
                address: body.address,
                _id: storeId,
                name: body.name,
                max_users: (_e = +body.max_users) !== null && _e !== void 0 ? _e : 0,
                post_code: body.post_code,
                representative_name: (_f = body.representative_name) !== null && _f !== void 0 ? _f : "",
                users: [user._id]
            });
            const validator = yield company.validateSync();
            if (validator) {
                return this.responseBadRequest(res, {
                    error: validator.message
                });
            }
            yield company.save();
            mailer_1.default.sendMail(manager_created_1.managerCreatedTemplate(user, body.password));
            this.responseSuccess(res, {
                message: "add_store_successfully",
                data: {
                    store: company.stores[company.stores.length - 1]
                },
            });
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const storeId = req.params.sid;
            const companyId = req.params.cid;
            const store = yield models_1.Company.findOneAndUpdate({
                _id: companyId,
            }, {
                $pull: {
                    stores: {
                        _id: storeId
                    }
                }
            });
            if (!store) {
                return this.responseNotFound(res, {
                    error: "store_not_found"
                });
            }
            yield models_1.User.deleteMany({
                company_id: companyId,
                role: {
                    $ne: "admin"
                },
                store_id: storeId,
            });
            yield models_1.Menu.deleteMany({
                company_id: companyId,
                store_id: storeId,
            });
            this.responseSuccess(res, {
                message: "deleted_successfully",
            });
        });
    }
}
exports.StoreController = StoreController;
//# sourceMappingURL=store.js.map