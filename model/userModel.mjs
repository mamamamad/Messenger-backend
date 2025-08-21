import { MongoDb } from "../globalMoudles.mjs";
import mongoose from "mongoose";
import userSchema from "./../structure/usersStructure.mjs";
import { log } from "../core/utils.mjs";
import { status } from "@grpc/grpc-js";

class Usermodel {
  #model2 = null;

  async init() {
    try {
      if (!MongoDb.db) {
        throw new Error("❌ Database is not initialized yet!");
      } else {
        this.#model2 = MongoDb.db.model("users", userSchema);
      }
    } catch (e) {
      log(e);
    }
  }
  async userExistEmail(value) {
    //check the email exist in database.
    try {
      const result = await this.#model2.find({ email: value }).exec();

      if (result.length !== 0) {
        return result;
      } else {
        return false;
      }
    } catch (e) {
      log(e);
    }
  }
  async userData(value) {
    //check the email exist in database.
    try {
      const result = await this.#model2.find({ email: value }).exec();

      if (result.length !== 0) {
        return result;
      } else {
        return false;
      }
    } catch (e) {
      log(e);
    }
  }
  async updateValue(key, value) {
   
    try {
      let updatecDoc = { $set: value };
      const result = await this.#model2.updateOne(key, updatecDoc);
      if (result.length !== 0) {
        return result;
      } else {
        return false;
      }
    } catch (e) {
      log(e);
    }
  }
  async userExistUsername(value) {
    //check the email exist in database.
    try {
      const result = await this.#model2.find({ username: value }).exec();

      if (result.length !== 0) {
        return result;
      } else {
        return false;
      }
    } catch (e) {
      log(e);
    }
  }
  async userExistId(value) {
    //check the email exist in database.
    try {
      const result = await this.#model2.find({ _id: value }).exec();

      if (result.length !== 0) {
        return result;
      } else {
        return false;
      }
    } catch (e) {
      log(e);
    }
  }
  async addUser(data) {
    try {
      const userExistemail = await this.userExistEmail(data.email);
      const userExistusername = await this.userExistUsername(data.username);

      if (userExistemail && userExistusername) {
        return false;
      } else {
        const row = new this.#model2(data);

        let result = await row.save();

        return result;
      }
    } catch (e) {
      log(e);
    }
  }
}

export default Usermodel;
