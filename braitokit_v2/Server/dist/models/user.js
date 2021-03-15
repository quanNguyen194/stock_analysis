"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./schema/user");
exports.default = mongoose_1.default.model("users", user_1.UserSchema);
//# sourceMappingURL=user.js.map