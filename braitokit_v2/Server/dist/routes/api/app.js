"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const home_1 = require("../../controllers/app/home");
const me_1 = require("../../controllers/app/me");
const menu_1 = require("../../controllers/app/menu");
const user_1 = require("../../controllers/app/user");
const auth_1 = require("../../middlewares/auth");
const dish_1 = require("../../controllers/app/dish");
const appRouter = express_1.default.Router();
const homeController = new home_1.HomeController();
const meController = new me_1.MeController();
const menuController = new menu_1.MenuController();
const userController = new user_1.UserController();
const dishController = new dish_1.DishController();
appRouter.use(auth_1.AuthMiddleware);
// Token
appRouter.get("/token/verify", homeController.checkToken);
appRouter.put("/units", homeController.updateUnits);
// Me
appRouter.put("/me", meController.updateInfo);
appRouter.put("/me/change-password", meController.changePassword);
// Menu
appRouter.get("/menu", menuController.list);
appRouter.post("/menu", menuController.create);
appRouter.get("/menu/:id", menuController.detail);
appRouter.delete("/menu/:id", menuController.delete);
appRouter.put("/menu/:id", menuController.update);
appRouter.delete("/menu/:mId/dishes/:dId", dishController.deleteInMenu);
// Dish
appRouter.get("/dishes", dishController.dishes);
appRouter.delete("/dishes/:dId", dishController.delete);
appRouter.post("/dishes", dishController.create);
// appRouter.get("/menu/:mId/dishes/:dId", dishController.detail);
appRouter.put("/dishes/:dId", dishController.update);
// User
appRouter.get("/users", userController.list);
appRouter.post("/users", userController.create);
appRouter.get("/users/:id", userController.detail);
appRouter.delete("/users/:id", userController.delete);
appRouter.put("/users/:id", userController.update);
exports.default = appRouter;
//# sourceMappingURL=app.js.map