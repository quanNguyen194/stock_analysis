import { Request, Response } from "express";
import API from "@/controllers/api";
import {Company} from "@/models";

/**
 * home controller
 */
export class HomeController extends API {

  checkToken = async(req: Request, res: Response) : Promise<any> => {
    const currentUser = req.currentUser;
    let company;
    try {
      company = await Company.findOne(
        {
          _id: currentUser.company_id,
          stores: {
            $elemMatch: {
              _id: currentUser.store_id,
            },
          }
        }, {
          name: 1,
          phone: 1,
          email: 1,
          representative_name: 1,
          post_code: 1,
          address: 1,
          url: 1,
          stores: {
            $elemMatch: {
              _id: currentUser.store_id,
            },
          }
        }
      );

      if(!company) {
        throw "company_or_store_deleted";
      }

    } catch (e) {
      if(currentUser.role !== "admin") {
        return this.responseUnprocessable(res, {
          error: "company_or_store_deleted",
        });
      }
    }

    if(company) {
      const store = company?.stores[0];
      const companyObj = company as any;
      companyObj.stores = undefined;

      return this.responseSuccess(res, {
        data: {
          user: currentUser,
          company: companyObj,
          is_preview: currentUser.is_preview,
          store,
        }
      });
    }

    return this.responseSuccess(res, {
      data: {
        user: currentUser,
      }
    });

  };

  updateUnits = async (req: Request, res: Response): Promise<any> => {
    const currentUser = req.currentUser;
    const units = req.body.units;

    if(units) {

      await Company.findOneAndUpdate(
        {
          _id: currentUser.company_id,
          stores: {
            $elemMatch: {
              _id: currentUser.store_id,
            }
          }
        },
        {
          $set: {
            "stores.$.units": units,
          }
        }
      );

      return this.responseSuccess(res, {
        message: "update successfully"
      });
    }

    return this.responseBadRequest(res, {
      error: "units cant be null"
    });
  }

}

