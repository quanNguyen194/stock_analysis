"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dish_1 = require("./schema/dish");
exports.default = mongoose_1.default.model("dishes", dish_1.DishSchema);
//# sourceMappingURL=dish.js.map