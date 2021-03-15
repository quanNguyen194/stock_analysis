import * as mongoose from "mongoose";
import { BaseSchema } from "./base";
import {Schema} from "mongoose";

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name_required"]
  },
  address: {
    type: String,
    required: [true, "address_required"]
  },
  max_users: {
    type: Number,
    required: [true, "max_users_required"]
  },
  post_code: {
    type: String,
    required: [true, "post_code_required"]
  },
  representative_name: {
    type: String,
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: "users"
  }],
  units: [{
    type: String,
  }],
}, BaseSchema);


const company = {
  name: {
    type: String,
    required: [true, "name_required"]
  },
  phone: {
    type: String,
    required: [true, "phone_required"]
  },
  email: {
    type: String,
    // required: [true, "email_required"]
  },
  representative_name: {
    type: String,
    required: [true, "representative_name_required"]
  },
  post_code: {
    type: String,
  },
  url: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "address_required"]
  },
  stores: [StoreSchema],
};

export const CompanySchema = new mongoose.Schema(company, BaseSchema);
