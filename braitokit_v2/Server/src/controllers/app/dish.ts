import { Request, Response } from "express";
import API from "@/controllers/api";
import {Dish, Menu} from "@/models";

/**
 * home controller
 */
export class DishController extends API {

  dishes = async (req: Request, res: Response) : Promise<any> => {
    const {currentUser} = req;

    try {
      const dishes = await Dish.find({
        company_id: currentUser.company_id,
        store_id: currentUser.store_id,
      }).populate("materials.material");

      return this.responseSuccess(res, {
        data: {dishes: dishes},
      });
    } catch (e) {
      return this.responseSuccess(res, {
        data: {
          dishes: [],
          error: e.message
        },
      });
    }
  };

  create = async(req: Request, res: Response) : Promise<any> => {
    const currentUser = req.currentUser;
    const body = req.body as any;

    const dish = new Dish(<any>{
      name: body.name,
      note: body.note,
      company_id: currentUser.company_id,
      store_id: currentUser.store_id,
      category: body.category,
      materials: body.materials,
    });

    const validator = await dish.validateSync();
    if(validator) {
      return this.responseUnprocessable(res, {
        error: "bad_request",
        message: validator.message
      });
    }
    await dish.save();

    return this.responseSuccess(res, {
      data: { dish },
      message: "create_successfully",
    });
  };

  update = async(req: Request, res: Response) : Promise<any> => {
    const dId = req.params.dId as string;
    const body = req.body as any;

    const dish = await Dish.findOneAndUpdate(
      {
        _id: dId
      },
      {
        $set: {
          "name": body.name,
          "note": body.note,
          "category": body.category,
          "materials": body.materials,
        }
      },
      {new: true}
    );

    if(!dish) {
      return this.responseNotFound(res, {
        error: "dish_not_found",
      });
    }

    return this.responseSuccess(res, {
      data: {
        dish: dish,
      },
      message: "update_successfully",
    });

  };

  deleteInMenu = async(req: Request, res: Response) : Promise<any> => {

    const mId = req.params.mId as string;
    const dId = req.params.dId as string;

    const menu = await Menu.findOneAndUpdate(
      {
        _id: mId,
      },
      {
        $pull: {
          dishes: { $in: [dId] },
        }
      },
      {
        new: true,
      }
    );

    if(!menu) {
      return this.responseNotFound(res, {
        error: "menu_or_dish_not_found",
      });
    }

    return this.responseSuccess(res, {
      message: "delete_successfully",
    });

  };


  delete = async(req: Request, res: Response) : Promise<any> => {
    const dId = req.params.dId as string;
    const currentUser = req.currentUser;

    const dish = await Dish.deleteOne({
      _id: dId,
      store_id: currentUser.store_id,
      company_id: currentUser.company_id,
    });

    if(!dish) {
      return this.responseNotFound(res, {
        error: "dish_not_found",
      });
    }

    return this.responseSuccess(res, {
      message: "delete_successfully",
    });

  };
}

