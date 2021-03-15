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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMiddleware = void 0;
const auth_1 = require("./auth");
/**
 * Auth middleware
 * @param req ..
 * @param res ..
 * @param next ..
 */
const AdminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_1.AuthMiddleware(req, res, () => null);
    const user = req.currentUser;
    if (user.role !== "admin") {
        return res.status(403).json({
            status: false,
            error: "admin_role_required"
        });
    }
    next();
});
exports.AdminMiddleware = AdminMiddleware;
//# sourceMappingURL=admin.js.map