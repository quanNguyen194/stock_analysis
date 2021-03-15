import { Request, Response } from "express";
import API from "@/controllers/api";
import {Company, Menu, User} from "@/models";
import { ObjectID } from "mongodb";
import {HashString} from "@/utils/md5";
import mailer from "@/utils/mailer";
import {managerCreatedTemplate} from "@/templates/manager_created";
import {managerUpdatedTemplate} from "@/templates/manager_updated";

/**
 * StoreController
 */
export class StoreController extends API {

  list = async (req: Request, res: Response): Promise<any> => {
    const companyId = req.params.cid as string;

    const companyQuery = await Company.findOne({
      _id: companyId
    }).select("stores").populate("stores.users");

    if(!companyQuery) {
      return this.responseBadRequest(res, {
        error: "company_not_found"
      });
    }

    const company = companyQuery.toObject();

    company!.stores = company!.stores.map((store : any) => {
      const users = (store.users.filter((user: any) => {
        return user.role == "manager";
      })) as any[];
      store.users_count = store.users.length;
      store.users = undefined;

      return {
        ...store,
        ...{
          email: users.length ? users[0].email : "",
          phone: users.length ? users[0].phone : "",
          representative_name: users.length ? users[0].name : ""
        }
      };
    });

    return this.responseSuccess(res, {
      data: {
        stores: company!.stores
      },
    });
  };

  detail = async (req: Request, res: Response): Promise<any> => {
    const companyId = req.params.cid as string;
    const storeId = req.params.sid as string;

    if(!storeId) {
      return this.responseBadRequest(res, {
        error: "store_id_required"
      });
    }

    if(!companyId) {
      return this.responseBadRequest(res, {
        error: "company_id_required"
      });
    }

    const company = await Company.findOne({
      _id: companyId,
      stores: {
        $elemMatch: {
          _id: storeId
        }
      }
    }, {
      stores: {
        $elemMatch: {
          _id: storeId
        }
      }
    }).populate("stores.users");

    if(!company) {
      return this.responseNotFound(res, {
        error: "company_not_found"
      });
    }

    const store = company.stores[0];
    this.responseSuccess(res, {
      message: "update_store_successfully",
      data: {
        store,
      },
    });
  };

  update = async (req: Request, res: Response): Promise<any> => {
    const body = req.body;
    const companyId = req.params.cid as string;
    const storeId = req.params.sid as string;

    const updateMap = {
      "stores.$.name": body.name,
      "stores.$.address": body.address,
      "stores.$.max_users": +body.max_users ?? 3,
      "stores.$.post_code": body.post_code,
      "stores.$.representative_name": body.representative_name ?? "",
    };

    const company = await Company.findOneAndUpdate(
      {
        _id: companyId,
        stores: {
          $elemMatch: {
            _id: storeId
          }
        }
      },
      {
        $set: updateMap
      },
      {
        projection: {
          stores: {
            $elemMatch: {
              _id: storeId
            }
          }
        },
        new: true
      }
    );

    if(!company) {
      return this.responseBadRequest(res, {
        error: "company_not_found"
      });
    }

    const updateUserMap =  new Map<string, any>();

    if(body.representative_name) {
      updateUserMap.set("name", body.representative_name);
      updateUserMap.set("name_kana",  body.representative_name);
    }

    if(body.password) {
      updateUserMap.set("password", HashString(body.password));
    }

    const checkUserFound = await User.find({
      $or: [
        {email: body.email},
        {phone: body.phone}
      ]
    }).countDocuments();

    if(checkUserFound > 1) {
      return this.responseUnprocessable(res, {
        error: "email_or_phone_already_exists"
      });
    }

    if(body.email) {
      updateUserMap.set("email", body.email);
    }

    if(body.phone) {
      updateUserMap.set("phone", body.phone);
    }

    const user = await User.findOneAndUpdate(
      {
        store_id: storeId,
        company_id: companyId,
        role: "manager"
      },
      {
        $set: updateUserMap
      },
      {new: true}
    );

    if(user && body.password) {
      mailer.sendMail(managerUpdatedTemplate(user, body.password));
    }

    this.responseSuccess(res, {
      message: "update_store_successfully",
      data: {
        store: company.stores[0]
      },
    });
  };


  create = async (req: Request, res: Response): Promise<any> => {
    const body = req.body;
    const companyId = req.params.cid as string;

    const company = await Company.findOne({
      _id: companyId
    });

    if(!company) {
      return this.responseBadRequest(res, {
        error: "company_not_found"
      });
    }

    const userFound = await User.findOne({
      $or: [
        {email: body.email},
        {phone: body.phone}
      ]
    });

    if(userFound) {
      return this.responseUnprocessable(res, {
        error: "email_or_phone_already_exists"
      });
    }

    const storeId = new ObjectID();

    const user = new User({
      store_id: storeId,
      company_id: companyId,
      name: body.representative_name ?? "",
      email: body.email,
      phone: body.phone,
      password: HashString(body.password),
      role: "manager",
      avatar: "",
      name_kana: body.representative_name ?? ""
    });

    await user.save();

    company.stores.push(<any>{
      address: body.address,
      _id: storeId,
      name: body.name,
      max_users: +body.max_users ?? 0,
      post_code: body.post_code,
      representative_name: body.representative_name ?? "",
      users: [user._id]
    });

    const validator = await company.validateSync();
    if(validator) {
      return this.responseBadRequest(res, {
        error: validator.message
      });
    }

    await company.save();

    mailer.sendMail(managerCreatedTemplate(user, body.password));

    this.responseSuccess(res, {
      message: "add_store_successfully",
      data: {
        store: company.stores[company.stores.length - 1]
      },
    });
  };

  delete = async (req: Request, res: Response): Promise<any> => {
    const storeId = req.params.sid;
    const companyId = req.params.cid;

    const store = await Company.findOneAndUpdate(
      {
        _id: companyId,
      },
      {
        $pull: {
          stores: <any>{
            _id: storeId as string
          }
        }
      }
    );

    if(!store) {
      return this.responseNotFound(res, {
        error: "store_not_found"
      });
    }

    await User.deleteMany({
      company_id: companyId,
      role: {
        $ne: "admin"
      },
      store_id: storeId,
    });

    await Menu.deleteMany({
      company_id: companyId,
      store_id: storeId,
    });

    this.responseSuccess(res, {
      message: "deleted_successfully",
    });
  };
}
