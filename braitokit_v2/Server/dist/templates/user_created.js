"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCreatedTemplate = void 0;
const config_1 = __importDefault(require("../configs/config"));
const userCreatedTemplate = (user, password) => {
    return {
        from: "cloud@braitokit.com",
        to: user.email,
        subject: "[Cloud Braitokit] your account was created",
        html: `
      <p><b>Created Account</b></p>
      <p>Hello <b>${user.name}</b>, Your account is active now! </p>
      <p>Login url: <a href="${config_1.default.SITE_URL}/login">${config_1.default.SITE_URL}/login</a></p>
      <p>Email: ${user.email}</p>
      <p>Phone: ${user.phone}</p>
      <p>Password: ${password}</p>
      <br>
      <p>Thanks!</p>
    `,
    };
};
exports.userCreatedTemplate = userCreatedTemplate;
//# sourceMappingURL=user_created.js.map