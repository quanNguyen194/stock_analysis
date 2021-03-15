import * as mongoose from "mongoose";
import {BaseSchema} from "@/models/schema/base";

const material = {
  name: {
    type: String,
    default: "",
  },
  value: {
    type: String,
    default: "",
  },
  unit: {
    type: String,
    default: "",
  },
};

export const MaterialSchema = new mongoose.Schema(material, BaseSchema);
