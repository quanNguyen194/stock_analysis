import mongoose, { Document } from "mongoose";
import { UserSchema } from "@/models/schema/user";

export interface IUser extends Document {
  email: string,
  phone: string,
  name: string,
  name_kana: string,
  avatar: string,
  password: string,
  role: string,
  store_id: string,
  company_id: string,
}

export default mongoose.model<IUser>("users", UserSchema);
