"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const admin_1 = require("../../middlewares/admin");
const company_1 = require("../../controllers/admin/company");
const store_1 = require("../../controllers/admin/store");
const adminRouter = express_1.default.Router();
const companyController = new company_1.CompanyController();
const storeController = new store_1.StoreController();
adminRouter.use(auth_1.AuthMiddleware);
adminRouter.use(admin_1.AdminMiddleware);
adminRouter.get("/companies", companyController.list);
adminRouter.post("/companies", companyController.create);
adminRouter.get("/companies/:id", companyController.detail);
adminRouter.delete("/companies/:id", companyController.delete);
adminRouter.put("/companies/:id", companyController.update);
adminRouter.get("/companies/:cid/stores", storeController.list);
adminRouter.post("/companies/:cid/stores", storeController.create);
adminRouter.get("/companies/:cid/stores/:sid", storeController.detail);
adminRouter.delete("/companies/:cid/stores/:sid", storeController.delete);
adminRouter.put("/companies/:cid/stores/:sid", storeController.update);
exports.default = adminRouter;
//# sourceMappingURL=admin.js.map