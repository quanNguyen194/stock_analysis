import * as mongoose from "mongoose";
import {BaseSchema} from "@/models/schema/base";


const menu = {
  store_id: {
    type: String,
    required: [true, "store_id_required"]
  },
  company_id: {
    type: String,
    required: [true, "compnay_id_required"]
  },
  note: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    default: "",
  },
  status: {
    type: Boolean,
    default: true
  },
  dishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "dishes"
  }]
};

export const MenuSchema = new mongoose.Schema(menu, BaseSchema);
