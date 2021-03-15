"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerCreatedTemplate = void 0;
const config_1 = __importDefault(require("../configs/config"));
const managerCreatedTemplate = (user, password) => {
    return {
        from: "cloud@braitokit.com",
        to: user.email,
        subject: "[Cloud Braitokit] Store already available",
        html: `
      <p>Hello <b>${user.name}</b>, Your store is active now! </p>
      <p>Login url: <a href="${config_1.default.SITE_URL}/login">${config_1.default.SITE_URL}/login</a></p>
      <p>Email: ${user.email}</p>
      <p>Phone: ${user.phone}</p>
      <p>Password: ${password}</p>
      <br>
      <p>Thanks!</p>
    `,
    };
};
exports.managerCreatedTemplate = managerCreatedTemplate;
//# sourceMappingURL=manager_created.js.map