import express from "express";
import {AuthMiddleware} from "@/middlewares/auth";
import {AdminMiddleware} from "@/middlewares/admin";
import {CompanyController} from "@/controllers/admin/company";
import {StoreController} from "@/controllers/admin/store";

const adminRouter = express.Router();
const companyController = new CompanyController();
const storeController = new StoreController();

adminRouter.use(AuthMiddleware);
adminRouter.use(AdminMiddleware);


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

export default adminRouter;
