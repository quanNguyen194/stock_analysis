import { Request, Response } from "express";
import API from "@/controllers/api";
import { User } from "@/models";
import {getFileExtension} from "@/utils/file";
import config from "@/configs/config";
import { UploadedFile } from "express-fileupload";
import {HashString} from "@/utils/md5";


export class MeController extends API {

  updateInfo = async(req: Request, res: Response): Promise<any> => {
    const currentUser = req.currentUser;
    const reqBody = req.body;
    const reqFiles = req.files;

    if (!reqBody) {
      return this.responseUnprocessable(res,{
        error: "missing_parameters",
      });
    }

    const updateMap = new Map<string, any>();

    // save avatar file
    if (reqFiles && reqFiles.avatar) {
      const avatar = reqFiles.avatar as any as UploadedFile;

      // Upload file to aws here
      const fileExtension = getFileExtension(avatar.mimetype);

      if (fileExtension) {

        const fileName = `${currentUser._id}_${Date.now()}.${fileExtension}`;
        const filePath = (config.MODE == "production" ? config.UPLOAD_FOLDER : "./uploads") + `/avatars/${fileName}`;
        await avatar.mv(filePath);

        updateMap.set("avatar", `uploads/avatars/${fileName}`);
      }
    }

    const keepProps = [
      "email", "phone", "name_kana", "password", "settings"
    ];

    for (const k in keepProps) {
      if (keepProps.indexOf(k) < 0) {
        delete reqBody[k];
      }
    }

    // update tabs
    if (reqBody.settings) {
      for (const property in reqBody.settings) {
        updateMap.set(`settings.${property}`, reqBody.settings[property]);
      }
      delete reqBody.settings;
    }

    // update other fields
    for (const property in reqBody) {
      updateMap.set(property, reqBody[property]);
    }

    const checkFound = await User.findOne({
      $or: [
        {email: reqBody.email},
        {phone: reqBody.phone}
      ],
    }).count();

    if(checkFound > 1) {
      return this.responseUnprocessable(res, {
        error: "email_or_phone_already_exists"
      });
    }

    let newInfo;
    if (updateMap.size > 0) {
      newInfo = await User.findOneAndUpdate(
        {_id: currentUser._id},
        {$set: updateMap},
        {new: true}
      );
    }

    this.responseSuccess(res,{
      message: "Success",
      data: {
        user: newInfo ?? currentUser,
      },
    });
  };

  changePassword = async (req: Request, res: Response): Promise<any> => {
    const currentUser = req.currentUser;
    const {new_password, old_password} = req.body;

    if(!new_password || !old_password) {
      return this.responseBadRequest(res, {
        error: "new_password and old_password is required"
      });
    }

    const checkUpdate = await User.findOneAndUpdate(
      {
        _id: currentUser._id,
        password: HashString(old_password)
      },
      {
        password: HashString(new_password)
      }
    );

    if(!checkUpdate) {
      return this.responseUnprocessable(res, {
        error: "old_password_incorrect"
      });
    }

    return this.responseSuccess(res,{
      message: "password_changed"
    });
  }

}
