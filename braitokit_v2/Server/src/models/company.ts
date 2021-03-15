import mongoose, { Document } from "mongoose";
import {CompanySchema} from "@/models/schema/company";

export interface IStore {
  name: string,
  max_users: number,
  post_code: string;
  prefecture: string;
  address: string;
  representative_name: string;
  users: Array<string>;
  units: Array<string>;
}


export interface ICompany extends Document {
  name: string,
  phone: string,
  email: string,
  representative_name: string,
  post_code: string,
  address: string,
  url: string,
  prefecture: string,
  stores: Array<IStore>
}

export default mongoose.model<ICompany>("companies", CompanySchema);
