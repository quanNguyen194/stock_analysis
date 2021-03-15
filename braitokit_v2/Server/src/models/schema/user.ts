import * as mongoose from "mongoose";
import { BaseSchema } from "./base";

const user = {
  store_id: {
    type: String,
  },
  company_id: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "email_required"]
  },
  phone: {
    type: String,
    required: [true, "phone_required"]
  },
  name: {
    type: String,
    required: [true, "name_required"]
  },
  name_kana: {
    type: String,
    required: [true, "name_kana_required"]
  },
  avatar: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    select: false
  },
  role: {
    type: String,
    default: "manager"
  }
};

export const UserSchema = new mongoose.Schema(user, BaseSchema);
