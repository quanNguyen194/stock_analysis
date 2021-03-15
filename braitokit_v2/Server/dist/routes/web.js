"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// catch 404 and forward to error handler
router.use("*", (_req, res) => {
    res.status(404).json({
        status: false,
        message: "404",
    });
});
exports.default = router;
//# sourceMappingURL=web.js.map