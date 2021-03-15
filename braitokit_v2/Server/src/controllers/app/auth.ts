import API from "@/controllers/api";
import {Request, Response} from "express";
import {Company, Token, User} from "@/models";
import jwt from "@/utils/jwt";
import {HashString} from "@/utils/md5";
import mailer from "@/utils/mailer";
import config from "@/configs";
import {forgotPasswordTemplate} from "@/templates/forgot_password";

/**
 * Auth controller
 * @param req
 * @param res
 */
export class AuthController extends API{

  login = async (req: Request, res: Response): Promise<any> => {

    if(!req.body.phone && !req.body.admin_id) {
      return this.responseBadRequest(res,{
        error: "phone_is_required"
      });
    }

    if(!req.body.password) {
      return this.responseBadRequest(res,{
        error: "password_is_required"
      });
    }

    let user;

    if(!req.body.admin_id) {
      user = await User.findOne({
        // $or: [
        //   { phone: req.body.phone },
        //   { email: req.body.phone }
        // ],
        email: req.body.phone.trim(),
        password: HashString(req.body.password),
      });
    } else {
      // for admin preview
      user = await User.findOne({
        _id: req.body.admin_id,
        password: HashString(req.body.password),
      });
    }

    if(!user) {
      return this.responseUnprocessable(res,{
        error: "incorrect_phone_email_or_password"
      });
    }

    if(req.body.company_id) {
      user.store_id = req.body.store_id;
      user.company_id = req.body.company_id;
    }

    let company;
    if(user.role !== "admin" || req.body.company_id) {
      company = await Company.findOne({
        _id: req.body.company_id || user.company_id,
        stores: {
          $elemMatch: {
            _id: user.store_id
          }
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
            _id: user.store_id
          }
        }
      });

      if (user.role != "admin" && !company) {
        return this.responseUnprocessable(res, {
          error: "company_or_store_not_found"
        });
      }
    }

    const userToken = await jwt.generateToken({
      user,
      admin_id: req.body.admin_id,
      store_id: req.body.store_id,
      company_id: req.body.company_id,
    });

    const data: any = {
      user,
      token: userToken,
    };
    if(company) {
      data["store"] = company?.stores[0];

      if(!data["store"].units || !data["store"].units.length) {
        const units = [
          "勺",
          "合",
          "升",
          "斗",
          "cc",
          "ml",
          "l",
          "cup",
          "g",
          "kg",
        ];
        data.store.units = units;

        await Company.findOneAndUpdate(
          {
            _id: user.company_id,
            stores: {
              $elemMatch: {
                _id: user.store_id,
              }
            }
          },
          {
            $set: {
              "stores.$.units": units,
            }
          }
        );
      }

      const companyObj = company as any;
      companyObj.stores = undefined;
      data["company"] = companyObj;
    }

    return this.responseSuccess(res,{
      data
    });
  };

  forgotPassword = async (req: Request, res: Response): Promise<any> => {
    const email = req.body.email;
    if(!email) {
      return this.responseBadRequest(res, {
        error: "email_is_required",
      });
    }

    const user = await User.findOne({
      email
    });
    if(!user) {
      return this.responseUnprocessable(res, {
        error: "email_not_found"
      });
    }

    const token = Buffer.from(Date.now().toLocaleString() + Date.now().toLocaleString() + Date.now().toLocaleString()).toString("base64");
    await Token.create({
      token,
      user_id: user._id.toString(),
      expire: Date.now() + (60 * 30 * 1000)
    });
    const link = `${config.SITE_URL}/reset-password?token=${token}`;
    mailer.sendMail(forgotPasswordTemplate(user, link));

    return this.responseSuccess(res, {
      message: "Sent email"
    });
  };

  resetPassword = async (req: Request, res: Response) : Promise<any> => {
    const { token, password } = req.body;
    if(!token || !password) {
      return this.responseBadRequest(res, {
        error: "token_and_password_required"
      });
    }

    if(password.length < 4) {
      return this.responseUnprocessable(res, {
        error: "invalid_password",
        message: "Password length must larger than 4 characters"
      });
    }

    const findToken = await Token.findOne({
      token,
    });

    if(!findToken || findToken.expire <= Date.now()) {
      return this.responseBadRequest(res, {
        error: "invalid_token"
      });
    }

    const user = await User.findOneAndUpdate({
      _id: findToken.user_id,
    }, {
      password: HashString(password)
    });

    if(!user) {
      return this.responseNotFound(res, {
        error: "user_not_found",
        message: "User not found"
      });
    }

    await Token.deleteMany({
      user_id: user._id.toString(),
    });
    return this.responseSuccess(res, {
      message: "change_password_successfully"
    });

  };

}
