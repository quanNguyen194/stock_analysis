import mongoose from "mongoose";
import {IMenu} from "@/models/menu";
import {DishSchema} from "@/models/schema/dish";

export interface IDishMaterial {
  id: string,
  value: string
}

export interface IDish {
  name: string,
  note: string,
  company_id: string;
  store_id: string;
  category: string,
  materials: Array<IDishMaterial>
}

export default mongoose.model<IMenu>("dishes", DishSchema);
