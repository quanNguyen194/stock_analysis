import * as mongoose from "mongoose";
import {BaseSchema} from "@/models/schema/base";
import {MaterialSchema} from "@/models/schema/material";

const dish = {
  name: {
    type: String,
    required: [true, "name_required"]
  },
  note: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    default: "かけ地"
  },
  company_id: {
    type: String,
  },
  store_id: {
    type: String,
  },
  materials: [MaterialSchema]
};

export const DishSchema = new mongoose.Schema(dish, BaseSchema);
