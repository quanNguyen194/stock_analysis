import { Request, Response } from "express";
import {AuthMiddleware} from "@/middlewares/auth";

/**
 * Auth middleware
 * @param req ..
 * @param res ..
 * @param next ..
 */
export const AdminMiddleware = async (req: Request, res: Response, next: any): Promise<any> => {
  await AuthMiddleware(req, res, () => null);

  const user = req.currentUser;
  if(user.role !== "admin") {
    return res.status(403).json({
      status: false,
      error: "admin_role_required"
    });
  }
  next();
};
