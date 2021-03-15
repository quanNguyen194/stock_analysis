"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const menu_1 = require("./schema/menu");
exports.default = mongoose_1.default.model("menus", menu_1.MenuSchema);
//# sourceMappingURL=menu.js.map