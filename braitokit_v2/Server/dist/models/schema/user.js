"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose = __importStar(require("mongoose"));
const base_1 = require("./base");
const user = {
    store_id: {
        type: String,
    },
    company_id: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "email_required"]
    },
    phone: {
        type: String,
        required: [true, "phone_required"]
    },
    name: {
        type: String,
        required: [true, "name_required"]
    },
    name_kana: {
        type: String,
        required: [true, "name_kana_required"]
    },
    avatar: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        select: false
    },
    role: {
        type: String,
        default: "manager"
    }
};
exports.UserSchema = new mongoose.Schema(user, base_1.BaseSchema);
//# sourceMappingURL=user.js.map