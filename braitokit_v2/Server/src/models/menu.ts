import mongoose, { Document } from "mongoose";
import {MenuSchema} from "@/models/schema/menu";

export interface IMenu extends Document {
  store_id: string,
  company_id: string,
  name: string,
  note: string,
  status: boolean,
  dishes: Array<string>
}

export default mongoose.model<IMenu>("menus", MenuSchema);
