import jwt from "@/utils/jwt";
import userModel from "@/models/user";
import { Request, Response } from "express";

/**
 * Auth middleware
 * @param req ..
 * @param res ..
 * @param next ..
 */
export const AuthMiddleware = async (req: Request, res: Response, next: any): Promise<any> => {
  const bearer = req.get("Authorization");
  if (!bearer) {
    res.status(403).json({
      error: "no_authorize",
      status: false,
    });
    return;
  }
  const splitBearer = bearer.split(" ");
  if (!splitBearer || !splitBearer.length || splitBearer.length != 2) {
    res.status(403).json({
      error: "no_authorize",
      status: false,
    });
    return;
  }

  const token = splitBearer[1];
  const decoded = jwt.parseToken(token);
  if (!decoded || !decoded.user) {
    res.status(403).json({
      error: "no_authorize",
      status: false,
    });
    return;
  }

  const user = await userModel.findOne({ _id: decoded.user._id });
  if (!user) {
    res.status(403).json({
      error: "no_authorize",
      status: false,
    });
    return;
  }

  const currentUser = user.toObject() as any;
  if(decoded.store_id) {
    currentUser.store_id = decoded.store_id;
    currentUser.company_id = decoded.company_id;
    currentUser.is_preview = true;
  }

  req.currentUser = currentUser;
  next();
};
