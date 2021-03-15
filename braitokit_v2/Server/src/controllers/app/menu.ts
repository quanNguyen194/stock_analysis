import API from "@/controllers/api";
import {Response, Request} from "express";
import {Menu} from "@/models";

export class MenuController extends API {

  list = async (req: Request, res: Response): Promise<any> => {
    const query = req.query as any;
    const offset = +(query.offset) | 0;
    const limit = +(query.limit) | 25;

    const {currentUser} = req;

    const menus = await Menu.find({
      store_id: currentUser.store_id,
      company_id: currentUser.company_id,
    }).sort({
      created_at: -1,
    }).select("-dishes").skip(offset).limit(limit);

    this.responseSuccess(res, {
      data: {
        offset,
        limit,
        menus
      }
    });
  };

  create = async (req: Request, res: Response): Promise<any> => {

    const {currentUser} = req;
    const body = req.body;

    const menu = new Menu({
      store_id: currentUser.store_id,
      company_id: currentUser.company_id,
      name: body.name,
      note: "",
      dishes: req.body.dishes || []
    });

    const validate = await menu.validateSync();

    if(validate) {
      return this.responseUnprocessable(res, {
        error: validate.message
      });
    }

    await menu.save();
    await menu.populate("dishes").execPopulate();

    this.responseSuccess(res, {
      data: {
        menu
      }
    });
  };

  // update a menu
  update = async (req: Request, res: Response): Promise<any> => {

    const menuId = req.params.id;
    const {currentUser} = req;
    if(!menuId) {
      return this.responseBadRequest(res, {
        error: "menu_id is required"
      });
    }

    const menu = await Menu.findOne({
      store_id: currentUser.store_id,
      company_id: currentUser.company_id,
      _id: menuId
    });

    if(!menu) {
      return this.responseNotFound(res, {
        error: "menu_not_found"
      });
    }

    if(req.body.name) {
      menu.name = req.body.name;
    }
    if(req.body.note) {
      menu.note = req.body.note ?? "";
    }
    if(req.body.dishes) {
      menu.dishes = req.body.dishes;
    }

    const validator = await menu.validateSync();
    if(validator) {
      return this.responseUnprocessable(res, {
        error: validator.message
      });
    }

    await menu.save();
    await menu.populate("dishes").execPopulate();

    return this.responseSuccess(res, {
      message: "update_menu_successfully",
      data: {
        menu
      }
    });
  };


  // delete a menu
  delete = async (req: Request, res: Response): Promise<any> => {
    const {currentUser} = req;
    await Menu.findOneAndDelete({
      store_id: currentUser.store_id,
      company_id: currentUser.company_id,
      _id: req.params.id
    });

    return this.responseSuccess(res, {
      message: "delete_menu_successfully"
    });
  };

  // detail of menu
  detail = async (req: Request, res: Response): Promise<any> => {
    const {currentUser} = req;
    const menu = await Menu.findOne({
      store_id: currentUser.store_id,
      company_id: currentUser.company_id,
      _id: req.params.id
    }).populate("dishes");

    if(!menu) {
      return this.responseNotFound(res, {
        error: "menu_not_found"
      });
    }

    return this.responseSuccess(res, {
      data: {
        menu
      }
    });
  };
}
