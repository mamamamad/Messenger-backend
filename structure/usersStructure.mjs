import pkg from "mongoose";
const { Schema } = pkg;
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
  avatar: {
    type: String,
    default: "/avatar/defualt.png",
  },

  date: { type: Date, default: Date.now },
});
