"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const token_1 = require("./schema/token");
exports.default = mongoose_1.default.model("tokens", token_1.TokenSchema);
//# sourceMappingURL=token.js.map