"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const nodemailer = require("nodemailer");
exports.default = nodemailer.createTransport({
    host: configs_1.default.SMTP.HOST,
    port: configs_1.default.SMTP.PORT,
    secure: true,
    auth: {
        user: configs_1.default.SMTP.USER,
        pass: configs_1.default.SMTP.PASSWORD,
    },
});
//# sourceMappingURL=mailer.js.map