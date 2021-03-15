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
exports.MenuSchema = void 0;
const mongoose = __importStar(require("mongoose"));
const base_1 = require("./base");
const menu = {
    store_id: {
        type: String,
        required: [true, "store_id_required"]
    },
    company_id: {
        type: String,
        required: [true, "compnay_id_required"]
    },
    note: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        default: "",
    },
    status: {
        type: Boolean,
        default: true
    },
    dishes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "dishes"
        }]
};
exports.MenuSchema = new mongoose.Schema(menu, base_1.BaseSchema);
//# sourceMappingURL=menu.js.map