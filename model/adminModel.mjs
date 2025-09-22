import { MongoDb } from "../globalMoudles.mjs";
import mongoose from "mongoose";
import timeZone from "mongoose-timezone";
import adminSchema from "./../structure/adminStructure.mjs";
import { log, getEnv } from "../core/utils.mjs";
import dataTime from "../core/dataTime.mjs";

adminSchema.plugin(timeZone, { paths: getEnv("TIME_ZONE") });
class Adminmodel {
  #model2 = null;

  async init() {
    try {
      if (!MongoDb.db) {
        throw new Error("❌ Database is not initialized yet!");
      } else {
        this.#model2 = MongoDb.db.model("admin", adminSchema);
      }
    } catch (e) {
      log(e);
    }
  }
  async adminExistEmail(value) {
    //check the email exist in database And retrieve all data.
    try {
      if (value) {
        const result = await this.#model2.find({ email: value }).exec();
        if (result.length !== 0) {
          return result;
        } else {
          return false;
        }
      }
      return false;
    } catch (e) {
      log(e);
    }
  }

  async updateLastLogin(value) {
    try {
      let updatecDoc = { $set: value };
      const result = await this.#model2.updateOne(lastLogin, updatecDoc);
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
  async adminExistNickname(value) {
    //check the username exist in database And retrieve all data.
    try {
      const result = await this.#model2.find({ nickName: value }).exec();

      if (result.length !== 0) {
        return result;
      } else {
        return false;
      }
    } catch (e) {
      log(e);
    }
  }
  async adminExistId(value) {
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
  async allAdmin() {
    try {
      const admins = await this.#model2.find().exec();
      let allAdmin = [];
      if (admins) {
        admins.map((item) => {
          let tmp = {};
          tmp.email = item.email;
          tmp.level = item.level;
          tmp.nickName = item.nickName;
          tmp.lastLogin = dataTime.timeToTimeZone(item.lastLogin);
          allAdmin.push(tmp);
        });
        return allAdmin;
      } else {
        return false;
      }
    } catch (e) {
      log(e);
    }
  }
  async addAdmin(data) {
    try {
      const userExistemail = await this.adminExistEmail(data.email);

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

export default Adminmodel;
