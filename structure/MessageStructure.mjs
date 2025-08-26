import { Schema } from "mongoose";

export default new Schema({
  id: {
    type: String,
    required: true,
    uniqe: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  dateEdit: { type: Date, default: Date.now },
  pin: {
    type: Boolean,
    default: true,
  },
  replay: { type: String, default: "" },
});
