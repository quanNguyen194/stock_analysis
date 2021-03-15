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
exports.DishController = void 0;
const api_1 = __importDefault(require("../api"));
const models_1 = require("../../models");
/**
 * home controller
 */
class DishController extends api_1.default {
    constructor() {
        super(...arguments);
        this.dishes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { currentUser } = req;
            try {
                const dishes = yield models_1.Dish.find({
                    company_id: currentUser.company_id,
                    store_id: currentUser.store_id,
                }).populate("materials.material");
                return this.responseSuccess(res, {
                    data: { dishes: dishes },
                });
            }
            catch (e) {
                return this.responseSuccess(res, {
                    data: {
                        dishes: [],
                        error: e.message
                    },
                });
            }
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.currentUser;
            const body = req.body;
            const dish = new models_1.Dish({
                name: body.name,
                note: body.note,
                company_id: currentUser.company_id,
                store_id: currentUser.store_id,
                category: body.category,
                materials: body.materials,
            });
            const validator = yield dish.validateSync();
            if (validator) {
                return this.responseUnprocessable(res, {
                    error: "bad_request",
                    message: validator.message
                });
            }
            yield dish.save();
            return this.responseSuccess(res, {
                data: { dish },
                message: "create_successfully",
            });
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dId = req.params.dId;
            const body = req.body;
            const dish = yield models_1.Dish.findOneAndUpdate({
                _id: dId
            }, {
                $set: {
                    "name": body.name,
                    "note": body.note,
                    "category": body.category,
                    "materials": body.materials,
                }
            }, { new: true });
            if (!dish) {
                return this.responseNotFound(res, {
                    error: "dish_not_found",
                });
            }
            return this.responseSuccess(res, {
                data: {
                    dish: dish,
                },
                message: "update_successfully",
            });
        });
        this.deleteInMenu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const mId = req.params.mId;
            const dId = req.params.dId;
            const menu = yield models_1.Menu.findOneAndUpdate({
                _id: mId,
            }, {
                $pull: {
                    dishes: { $in: [dId] },
                }
            }, {
                new: true,
            });
            if (!menu) {
                return this.responseNotFound(res, {
                    error: "menu_or_dish_not_found",
                });
            }
            return this.responseSuccess(res, {
                message: "delete_successfully",
            });
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dId = req.params.dId;
            const currentUser = req.currentUser;
            const dish = yield models_1.Dish.deleteOne({
                _id: dId,
                store_id: currentUser.store_id,
                company_id: currentUser.company_id,
            });
            if (!dish) {
                return this.responseNotFound(res, {
                    error: "dish_not_found",
                });
            }
            return this.responseSuccess(res, {
                message: "delete_successfully",
            });
        });
    }
}
exports.DishController = DishController;
//# sourceMappingURL=dish.js.map