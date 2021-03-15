import { Request, Response } from "express";
import API from "@/controllers/api";
import {Company, User} from "@/models";
import {HashString} from "@/utils/md5";
import mailer from "@/utils/mailer";
import {userCreatedTemplate} from "@/templates/user_created";
import {userUpdatedTemplate} from "@/templates/user_updated";


/**
 * home controller
 */
export class UserController extends API {

  list = async(req: Request, res: Response) : Promise<any> => {

    const {currentUser} = req;

    const users = await User.find({
      store_id: currentUser.store_id,
      company_id: currentUser.company_id,
    });

    if(!users) {
      return this.responseNotFound(res, {
        error: "users_not_found"
      });
    }

    this.responseSuccess(res,{
      data: {
        users,
      },
    });
  };


  create = async(req: Request, res: Response) : Promise<any> => {
    const {currentUser} = req;

    const user = new User({
      name: req.body.name,
      store_id: currentUser.store_id,
      company_id: currentUser.company_id,
      name_kana: req.body.name_kana,
      phone: req.body.phone,
      email: req.body.email,
      role: "user",
      company: req.body.company,
      password: req.body.password
    });


    // validate
    const validator = await user.validateSync();
    if(validator) {
      return this.responseBadRequest(res, {
        error: validator.message
      });
    }

    //set user password
    user.password = HashString(user.password);

    // check user email and password
    const checkUserExists = await User.findOne({
      $or: [{ email: user.email }, { phone: user.phone }],
    });

    if(checkUserExists) {
      return this.responseUnprocessable(res, {
        error: "email_or_phone_already_exists"
      });
    }


    // find company
    const company = await Company.findOneAndUpdate(
      {
        _id: currentUser.company_id,
        stores: {
          $elemMatch: {
            _id: currentUser.store_id
          }
        }
      },
      {
        $push: {
          "stores.$.users": user._id,
        }
      },
      {
        new: true
      }
    );

    if(!company || company.stores.length === 0) {
      return this.responseNotFound(res, {
        error: "store_not_found"
      });
    }

    // save user and add user id to company
    await user.save();
    mailer.sendMail(userCreatedTemplate(user, req.body.password));

    this.responseSuccess(res,{
      message: "add_user_successfully",
      data: {
        user: user,
      },
    });
  };

  // update user
  update = async(req: Request, res: Response) : Promise<any> => {

    const {currentUser} = req;
    const userId = req.params.id;
    const reqBody = req.body;

    // check user exists
    const user = await User.findOne({
      _id: userId,
      store_id: currentUser.store_id,
      company_id: currentUser.company_id
    });

    if(!user) {
      return this.responseUnprocessable(res, {
        error: "user_not_found"
      });
    }

    const keepProps = [
      "name", "name_kana", "phone", "email", "company", "password"
    ];

    for (const k in keepProps) {
      if (keepProps.indexOf(k) < 0) {
        delete reqBody[k];
      }
    }

    // hash password
    if(reqBody.password) {
      reqBody.password = HashString(reqBody.password);
    } else {
      reqBody.password = undefined;
      delete reqBody.password;
    }

    // update other fields
    for (const property in reqBody) {
      user.set(property, reqBody[property]);
    }

    // check user email and password
    const checkUserExists = await User.findOne({
      $or: [{ email: user.email }, { phone: user.phone }],
    }).countDocuments();

    if(checkUserExists > 1) {
      return this.responseUnprocessable(res, {
        error: "email_or_phone_already_exists"
      });
    }

    // validate
    const validator = await user.validateSync();
    if(validator) {
      return this.responseBadRequest(res, {
        error: validator.message
      });
    }

    // save user and add user id to store
    await user.save();
    mailer.sendMail(userUpdatedTemplate(user, reqBody.passaword ?? ""));

    return this.responseSuccess(res,{
      message: "update_user_successfully",
      data: {
        user: user,
      },
    });
  };


  // update user
  detail = async(req: Request, res: Response) : Promise<any> => {

    const {currentUser} = req;
    const userId = req.params.id;

    if(!userId) {
      return this.responseNotFound(res, {
        error: "user_id_required"
      });
    }

    // check user exists
    const user = await User.findOne({
      _id: userId,
      store_id: currentUser.store_id,
      company_id: currentUser.company_id
    });

    if(!user) {
      return this.responseUnprocessable(res, {
        error: "user_not_found"
      });
    }

    this.responseSuccess(res,{
      data: {
        user: user,
      },
    });
  };

  // update user
  delete = async(req: Request, res: Response) : Promise<any> => {

    const {currentUser} = req;
    const userId = req.params.id;

    if(userId === currentUser._id.toString()) {
      return this.responseUnprocessable(res, {
        error: "can_not_delete_your_self"
      });
    }

    if(!userId) {
      return this.responseNotFound(res, {
        error: "user_id_required"
      });
    }

    // check user exists
    const user = await User.findOne({
      _id: userId,
      store_id: currentUser.store_id,
      company_id: currentUser.company_id
    });

    if(!user) {
      return this.responseUnprocessable(res, {
        error: "user_not_found"
      });
    }
    await user.deleteOne();

    // find company
    const company = await Company.findOneAndUpdate(
      {
        _id: currentUser.company_id,
        stores: {
          $elemMatch: {
            _id: currentUser.store_id,
          }
        }
      },
      {
        $pull: {
          "stores.[].users": userId
        }
      }
    );

    if(!company) {
      return this.responseNotFound(res, {
        error: "store_not_found"
      });
    }

    this.responseSuccess(res,{
      message: "delete_user_successfully"
    });
  };

}

