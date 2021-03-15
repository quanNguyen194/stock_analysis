"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = __importDefault(require("./web"));
const admin_1 = __importDefault(require("./api/admin"));
const app_1 = __importDefault(require("./api/app"));
exports.default = {
    webRoutes: web_1.default,
    appApiRoutes: app_1.default,
    adminApiRoutes: admin_1.default
};
//# sourceMappingURL=index.js.map