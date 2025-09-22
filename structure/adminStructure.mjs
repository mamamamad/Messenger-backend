import pkg from "mongoose";
const { Schema } = pkg;
export default new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  nickName: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 2,
  },
  avatar: {
    type: String,
    default: "/media/avatar/adminDefualt.png",
  },
  date: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});
