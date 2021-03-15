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
exports.AuthMiddleware = void 0;
const jwt_1 = __importDefault(require("../utils/jwt"));
const user_1 = __importDefault(require("../models/user"));
/**
 * Auth middleware
 * @param req ..
 * @param res ..
 * @param next ..
 */
const AuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bearer = req.get("Authorization");
    if (!bearer) {
        res.status(403).json({
            error: "no_authorize",
            status: false,
        });
        return;
    }
    const splitBearer = bearer.split(" ");
    if (!splitBearer || !splitBearer.length || splitBearer.length != 2) {
        res.status(403).json({
            error: "no_authorize",
            status: false,
        });
        return;
    }
    const token = splitBearer[1];
    const decoded = jwt_1.default.parseToken(token);
    if (!decoded || !decoded.user) {
        res.status(403).json({
            error: "no_authorize",
            status: false,
        });
        return;
    }
    const user = yield user_1.default.findOne({ _id: decoded.user._id });
    if (!user) {
        res.status(403).json({
            error: "no_authorize",
            status: false,
        });
        return;
    }
    const currentUser = user.toObject();
    if (decoded.store_id) {
        currentUser.store_id = decoded.store_id;
        currentUser.company_id = decoded.company_id;
        currentUser.is_preview = true;
    }
    req.currentUser = currentUser;
    next();
});
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.js.map