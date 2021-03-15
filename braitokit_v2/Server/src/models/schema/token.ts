import * as mongoose from "mongoose";
import {BaseSchema} from "@/models/schema/base";

export const TokenSchema = new mongoose.Schema({
  expire: {
    type: Number,
    default: Date.now(),
  },
  user_id: {
    type: String,
    required: [true, "user_id_required"]
  },
  token: {
    type: String,
    required: [true, "token_required"]
  },
}, BaseSchema);
