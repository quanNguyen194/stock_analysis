import mongoose, { Document } from "mongoose";
import {TokenSchema} from "@/models/schema/token";

export interface IToken extends Document{
  expire: number;
  user_id: string;
  token: string;
}

export default mongoose.model<IToken>("tokens", TokenSchema);
