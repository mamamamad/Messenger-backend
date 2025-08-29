import mongoose from "mongoose";
import { log } from "./utils.mjs";

class MongoDB {
  #db = null;

  get db() {
    return this.#db;
  }

  async init(URI) {
    try {
      this.#db = await mongoose.createConnection(URI);
      return true;
    } catch (e) {
      log(`MongoDB Error : ${e.toString()}`);
      return false;
    }
  }
}

export default MongoDB;
