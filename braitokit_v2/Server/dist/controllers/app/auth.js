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
exports.AuthController = void 0;
const api_1 = __importDefault(require("../api"));
const models_1 = require("../../models");
const jwt_1 = __importDefault(require("../../utils/jwt"));
const md5_1 = require("../../utils/md5");
const mailer_1 = __importDefault(require("../../utils/mailer"));
const configs_1 = __importDefault(require("../../configs"));
const forgot_password_1 = require("../../templates/forgot_password");
/**
 * Auth controller
 * @param req
 * @param res
 */
class AuthController extends api_1.default {
    constructor() {
        super(...arguments);
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.phone && !req.body.admin_id) {
                return this.responseBadRequest(res, {
                    error: "phone_is_required"
                });
            }
            if (!req.body.password) {
                return this.responseBadRequest(res, {
                    error: "password_is_required"
                });
            }
            let user;
            if (!req.body.admin_id) {
                user = yield models_1.User.findOne({
                    // $or: [
                    //   { phone: req.body.phone },
                    //   { email: req.body.phone }
                    // ],
                    email: req.body.phone.trim(),
                    password: md5_1.HashString(req.body.password),
                });
            }
            else {
                // for admin preview
                user = yield models_1.User.findOne({
                    _id: req.body.admin_id,
                    password: md5_1.HashString(req.body.password),
                });
            }
            if (!user) {
                return this.responseUnprocessable(res, {
                    error: "incorrect_phone_email_or_password"
                });
            }
            if (req.body.company_id) {
                user.store_id = req.body.store_id;
                user.company_id = req.body.company_id;
            }
            let company;
            if (user.role !== "admin" || req.body.company_id) {
                company = yield models_1.Company.findOne({
                    _id: req.body.company_id || user.company_id,
                    stores: {
                        $elemMatch: {
                            _id: user.store_id
                        }
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
                            _id: user.store_id
                        }
                    }
                });
                if (user.role != "admin" && !company) {
                    return this.responseUnprocessable(res, {
                        error: "company_or_store_not_found"
                    });
                }
            }
            const userToken = yield jwt_1.default.generateToken({
                user,
                admin_id: req.body.admin_id,
                store_id: req.body.store_id,
                company_id: req.body.company_id,
            });
            const data = {
                user,
                token: userToken,
            };
            if (company) {
                data["store"] = company === null || company === void 0 ? void 0 : company.stores[0];
                if (!data["store"].units || !data["store"].units.length) {
                    const units = [
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
                    ];
                    data.store.units = units;
                    yield models_1.Company.findOneAndUpdate({
                        _id: user.company_id,
                        stores: {
                            $elemMatch: {
                                _id: user.store_id,
                            }
                        }
                    }, {
                        $set: {
                            "stores.$.units": units,
                        }
                    });
                }
                const companyObj = company;
                companyObj.stores = undefined;
                data["company"] = companyObj;
            }
            return this.responseSuccess(res, {
                data
            });
        });
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            if (!email) {
                return this.responseBadRequest(res, {
                    error: "email_is_required",
                });
            }
            const user = yield models_1.User.findOne({
                email
            });
            if (!user) {
                return this.responseUnprocessable(res, {
                    error: "email_not_found"
                });
            }
            const token = Buffer.from(Date.now().toLocaleString() + Date.now().toLocaleString() + Date.now().toLocaleString()).toString("base64");
            yield models_1.Token.create({
                token,
                user_id: user._id.toString(),
                expire: Date.now() + (60 * 30 * 1000)
            });
            const link = `${configs_1.default.SITE_URL}/reset-password?token=${token}`;
            mailer_1.default.sendMail(forgot_password_1.forgotPasswordTemplate(user, link));
            return this.responseSuccess(res, {
                message: "Sent email"
            });
        });
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, password } = req.body;
            if (!token || !password) {
                return this.responseBadRequest(res, {
                    error: "token_and_password_required"
                });
            }
            if (password.length < 4) {
                return this.responseUnprocessable(res, {
                    error: "invalid_password",
                    message: "Password length must larger than 4 characters"
                });
            }
            const findToken = yield models_1.Token.findOne({
                token,
            });
            if (!findToken || findToken.expire <= Date.now()) {
                return this.responseBadRequest(res, {
                    error: "invalid_token"
                });
            }
            const user = yield models_1.User.findOneAndUpdate({
                _id: findToken.user_id,
            }, {
                password: md5_1.HashString(password)
            });
            if (!user) {
                return this.responseNotFound(res, {
                    error: "user_not_found",
                    message: "User not found"
                });
            }
            yield models_1.Token.deleteMany({
                user_id: user._id.toString(),
            });
            return this.responseSuccess(res, {
                message: "change_password_successfully"
            });
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.js.map