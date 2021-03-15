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
exports.CompanySchema = void 0;
const mongoose = __importStar(require("mongoose"));
const base_1 = require("./base");
const mongoose_1 = require("mongoose");
const StoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name_required"]
    },
    address: {
        type: String,
        required: [true, "address_required"]
    },
    max_users: {
        type: Number,
        required: [true, "max_users_required"]
    },
    post_code: {
        type: String,
        required: [true, "post_code_required"]
    },
    representative_name: {
        type: String,
    },
    users: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "users"
        }],
    units: [{
            type: String,
        }],
}, base_1.BaseSchema);
const company = {
    name: {
        type: String,
        required: [true, "name_required"]
    },
    phone: {
        type: String,
        required: [true, "phone_required"]
    },
    email: {
        type: String,
    },
    representative_name: {
        type: String,
        required: [true, "representative_name_required"]
    },
    post_code: {
        type: String,
    },
    url: {
        type: String,
    },
    address: {
        type: String,
        required: [true, "address_required"]
    },
    stores: [StoreSchema],
};
exports.CompanySchema = new mongoose.Schema(company, base_1.BaseSchema);
//# sourceMappingURL=company.js.map