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
exports.MenuController = void 0;
const api_1 = __importDefault(require("../api"));
const models_1 = require("../../models");
class MenuController extends api_1.default {
    constructor() {
        super(...arguments);
        this.list = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const offset = +(query.offset) | 0;
            const limit = +(query.limit) | 25;
            const { currentUser } = req;
            const menus = yield models_1.Menu.find({
                store_id: currentUser.store_id,
                company_id: currentUser.company_id,
            }).sort({
                created_at: -1,
            }).select("-dishes").skip(offset).limit(limit);
            this.responseSuccess(res, {
                data: {
                    offset,
                    limit,
                    menus
                }
            });
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { currentUser } = req;
            const body = req.body;
            const menu = new models_1.Menu({
                store_id: currentUser.store_id,
                company_id: currentUser.company_id,
                name: body.name,
                note: "",
                dishes: req.body.dishes || []
            });
            const validate = yield menu.validateSync();
            if (validate) {
                return this.responseUnprocessable(res, {
                    error: validate.message
                });
            }
            yield menu.save();
            yield menu.populate("dishes").execPopulate();
            this.responseSuccess(res, {
                data: {
                    menu
                }
            });
        });
        // update a menu
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const menuId = req.params.id;
            const { currentUser } = req;
            if (!menuId) {
                return this.responseBadRequest(res, {
                    error: "menu_id is required"
                });
            }
            const menu = yield models_1.Menu.findOne({
                store_id: currentUser.store_id,
                company_id: currentUser.company_id,
                _id: menuId
            });
            if (!menu) {
                return this.responseNotFound(res, {
                    error: "menu_not_found"
                });
            }
            if (req.body.name) {
                menu.name = req.body.name;
            }
            if (req.body.note) {
                menu.note = (_a = req.body.note) !== null && _a !== void 0 ? _a : "";
            }
            if (req.body.dishes) {
                menu.dishes = req.body.dishes;
            }
            const validator = yield menu.validateSync();
            if (validator) {
                return this.responseUnprocessable(res, {
                    error: validator.message
                });
            }
            yield menu.save();
            yield menu.populate("dishes").execPopulate();
            return this.responseSuccess(res, {
                message: "update_menu_successfully",
                data: {
                    menu
                }
            });
        });
        // delete a menu
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { currentUser } = req;
            yield models_1.Menu.findOneAndDelete({
                store_id: currentUser.store_id,
                company_id: currentUser.company_id,
                _id: req.params.id
            });
            return this.responseSuccess(res, {
                message: "delete_menu_successfully"
            });
        });
        // detail of menu
        this.detail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { currentUser } = req;
            const menu = yield models_1.Menu.findOne({
                store_id: currentUser.store_id,
                company_id: currentUser.company_id,
                _id: req.params.id
            }).populate("dishes");
            if (!menu) {
                return this.responseNotFound(res, {
                    error: "menu_not_found"
                });
            }
            return this.responseSuccess(res, {
                data: {
                    menu
                }
            });
        });
    }
}
exports.MenuController = MenuController;
//# sourceMappingURL=menu.js.map