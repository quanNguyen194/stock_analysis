import express from "express";
import {HomeController} from "@/controllers/app/home";
import {MeController} from "@/controllers/app/me";
import {MenuController} from "@/controllers/app/menu";
import {UserController} from "@/controllers/app/user";
import {AuthMiddleware} from "@/middlewares/auth";
import {DishController} from "@/controllers/app/dish";

const appRouter = express.Router();

const homeController = new HomeController();
const meController = new MeController();
const menuController = new MenuController();
const userController = new UserController();
const dishController = new DishController();

appRouter.use(AuthMiddleware);

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

export default appRouter;
