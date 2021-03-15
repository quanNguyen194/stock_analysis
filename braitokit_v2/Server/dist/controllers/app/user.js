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
exports.UserController = void 0;
const api_1 = __importDefault(require("../api"));
const models_1 = require("../../models");
const md5_1 = require("../../utils/md5");
const mailer_1 = __importDefault(require("../../utils/mailer"));
const user_created_1 = require("../../templates/user_created");
const user_updated_1 = require("../../templates/user_updated");
/**
 * home controller
 */
class UserController extends api_1.default {
    constructor() {
        super(...arguments);
        this.list = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { currentUser } = req;
            const users = yield models_1.User.find({
                store_id: currentUser.store_id,
                company_id: currentUser.company_id,
            });
            if (!users) {
                return this.responseNotFound(res, {
                    error: "users_not_found"
                });
            }
            this.responseSuccess(res, {
                data: {
                    users,
                },
            });
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { currentUser } = req;
            const user = new models_1.User({
                name: req.body.name,
                store_id: currentUser.store_id,
                company_id: currentUser.company_id,
                name_kana: req.body.name_kana,
                phone: req.body.phone,
                email: req.body.email,
                role: "user",
                company: req.body.company,
                password: req.body.password
            });
            // validate
            const validator = yield user.validateSync();
            if (validator) {
                return this.responseBadRequest(res, {
                    error: validator.message
                });
            }
            //set user password
            user.password = md5_1.HashString(user.password);
            // check user email and password
            const checkUserExists = yield models_1.User.findOne({
                $or: [{ email: user.email }, { phone: user.phone }],
            });
            if (checkUserExists) {
                return this.responseUnprocessable(res, {
                    error: "email_or_phone_already_exists"
                });
            }
            // find company
            const company = yield models_1.Company.findOneAndUpdate({
                _id: currentUser.company_id,
                stores: {
                    $elemMatch: {
                        _id: currentUser.store_id
                    }
                }
            }, {
                $push: {
                    "stores.$.users": user._id,
                }
            }, {
                new: true
            });
            if (!company || company.stores.length === 0) {
                return this.responseNotFound(res, {
                    error: "store_not_found"
                });
            }
            // save user and add user id to company
            yield user.save();
            mailer_1.default.sendMail(user_created_1.userCreatedTemplate(user, req.body.password));
            this.responseSuccess(res, {
                message: "add_user_successfully",
                data: {
                    user: user,
                },
            });
        });
        // update user
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { currentUser } = req;
            const userId = req.params.id;
            const reqBody = req.body;
            // check user exists
            const user = yield models_1.User.findOne({
                _id: userId,
                store_id: currentUser.store_id,
                company_id: currentUser.company_id
            });
            if (!user) {
                return this.responseUnprocessable(res, {
                    error: "user_not_found"
                });
            }
            const keepProps = [
                "name", "name_kana", "phone", "email", "company", "password"
            ];
            for (const k in keepProps) {
                if (keepProps.indexOf(k) < 0) {
                    delete reqBody[k];
                }
            }
            // hash password
            if (reqBody.password) {
                reqBody.password = md5_1.HashString(reqBody.password);
            }
            else {
                reqBody.password = undefined;
                delete reqBody.password;
            }
            // update other fields
            for (const property in reqBody) {
                user.set(property, reqBody[property]);
            }
            // check user email and password
            const checkUserExists = yield models_1.User.findOne({
                $or: [{ email: user.email }, { phone: user.phone }],
            }).countDocuments();
            if (checkUserExists > 1) {
                return this.responseUnprocessable(res, {
                    error: "email_or_phone_already_exists"
                });
            }
            // validate
            const validator = yield user.validateSync();
            if (validator) {
                return this.responseBadRequest(res, {
                    error: validator.message
                });
            }
            // save user and add user id to store
            yield user.save();
            mailer_1.default.sendMail(user_updated_1.userUpdatedTemplate(user, (_a = reqBody.passaword) !== null && _a !== void 0 ? _a : ""));
            return this.responseSuccess(res, {
                message: "update_user_successfully",
                data: {
                    user: user,
                },
            });
        });
        // update user
        this.detail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { currentUser } = req;
            const userId = req.params.id;
            if (!userId) {
                return this.responseNotFound(res, {
                    error: "user_id_required"
                });
            }
            // check user exists
            const user = yield models_1.User.findOne({
                _id: userId,
                store_id: currentUser.store_id,
                company_id: currentUser.company_id
            });
            if (!user) {
                return this.responseUnprocessable(res, {
                    error: "user_not_found"
                });
            }
            this.responseSuccess(res, {
                data: {
                    user: user,
                },
            });
        });
        // update user
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { currentUser } = req;
            const userId = req.params.id;
            if (userId === currentUser._id.toString()) {
                return this.responseUnprocessable(res, {
                    error: "can_not_delete_your_self"
                });
            }
            if (!userId) {
                return this.responseNotFound(res, {
                    error: "user_id_required"
                });
            }
            // check user exists
            const user = yield models_1.User.findOne({
                _id: userId,
                store_id: currentUser.store_id,
                company_id: currentUser.company_id
            });
            if (!user) {
                return this.responseUnprocessable(res, {
                    error: "user_not_found"
                });
            }
            yield user.deleteOne();
            // find company
            const company = yield models_1.Company.findOneAndUpdate({
                _id: currentUser.company_id,
                stores: {
                    $elemMatch: {
                        _id: currentUser.store_id,
                    }
                }
            }, {
                $pull: {
                    "stores.[].users": userId
                }
            });
            if (!company) {
                return this.responseNotFound(res, {
                    error: "store_not_found"
                });
            }
            this.responseSuccess(res, {
                message: "delete_user_successfully"
            });
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.js.map