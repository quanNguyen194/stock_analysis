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
exports.MeController = void 0;
const api_1 = __importDefault(require("../api"));
const models_1 = require("../../models");
const file_1 = require("../../utils/file");
const config_1 = __importDefault(require("../../configs/config"));
const md5_1 = require("../../utils/md5");
class MeController extends api_1.default {
    constructor() {
        super(...arguments);
        this.updateInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.currentUser;
            const reqBody = req.body;
            const reqFiles = req.files;
            if (!reqBody) {
                return this.responseUnprocessable(res, {
                    error: "missing_parameters",
                });
            }
            const updateMap = new Map();
            // save avatar file
            if (reqFiles && reqFiles.avatar) {
                const avatar = reqFiles.avatar;
                // Upload file to aws here
                const fileExtension = file_1.getFileExtension(avatar.mimetype);
                if (fileExtension) {
                    const fileName = `${currentUser._id}_${Date.now()}.${fileExtension}`;
                    const filePath = (config_1.default.MODE == "production" ? config_1.default.UPLOAD_FOLDER : "./uploads") + `/avatars/${fileName}`;
                    yield avatar.mv(filePath);
                    updateMap.set("avatar", `uploads/avatars/${fileName}`);
                }
            }
            const keepProps = [
                "email", "phone", "name_kana", "password", "settings"
            ];
            for (const k in keepProps) {
                if (keepProps.indexOf(k) < 0) {
                    delete reqBody[k];
                }
            }
            // update tabs
            if (reqBody.settings) {
                for (const property in reqBody.settings) {
                    updateMap.set(`settings.${property}`, reqBody.settings[property]);
                }
                delete reqBody.settings;
            }
            // update other fields
            for (const property in reqBody) {
                updateMap.set(property, reqBody[property]);
            }
            const checkFound = yield models_1.User.findOne({
                $or: [
                    { email: reqBody.email },
                    { phone: reqBody.phone }
                ],
            }).count();
            if (checkFound > 1) {
                return this.responseUnprocessable(res, {
                    error: "email_or_phone_already_exists"
                });
            }
            let newInfo;
            if (updateMap.size > 0) {
                newInfo = yield models_1.User.findOneAndUpdate({ _id: currentUser._id }, { $set: updateMap }, { new: true });
            }
            this.responseSuccess(res, {
                message: "Success",
                data: {
                    user: newInfo !== null && newInfo !== void 0 ? newInfo : currentUser,
                },
            });
        });
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.currentUser;
            const { new_password, old_password } = req.body;
            if (!new_password || !old_password) {
                return this.responseBadRequest(res, {
                    error: "new_password and old_password is required"
                });
            }
            const checkUpdate = yield models_1.User.findOneAndUpdate({
                _id: currentUser._id,
                password: md5_1.HashString(old_password)
            }, {
                password: md5_1.HashString(new_password)
            });
            if (!checkUpdate) {
                return this.responseUnprocessable(res, {
                    error: "old_password_incorrect"
                });
            }
            return this.responseSuccess(res, {
                message: "password_changed"
            });
        });
    }
}
exports.MeController = MeController;
//# sourceMappingURL=me.js.map