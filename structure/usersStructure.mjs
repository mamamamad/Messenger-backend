import { Schema } from "mongoose";

export default new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: { type: String, required: true },
  Fname: { type: String, required: true },
  Lname: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  date: { type: Date, default: Date.now },
});
