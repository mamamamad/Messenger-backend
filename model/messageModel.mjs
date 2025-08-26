import { MongoDb } from "../globalMoudles.mjs";
import mongoose from "mongoose";
import messageSchema from "../structure/MessageStructure.mjs";
import { log, getEnv } from "../core/utils.mjs";
import dataTime from "../core/dataTime.mjs";
import { v4 } from "uuid";
class MessageModel {
  #model2 = null;
  async init() {
    try {
      if (!MongoDb.db) {
        throw new Error("❌ Database is not initialized yet!");
      } else {
        this.#model2 = MongoDb.db.model("messages", messageSchema);
      }
    } catch (e) {
      log(e);
    }
  }

  async updateMessage(id, newMessage) {
    try {
      let key = { id: id };
      let updatecDoc = { $set: { content: newMessage, dateEdit: Date.now() } };
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
  async messageExistEmail(value) {
    //check the username exist in database And retrieve all data.
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
  async messageExistid(value) {
    //check the username exist in database And retrieve all data.
    try {
      let result = await this.#model2.find({ id: value }).exec();

      if (result.length !== 0) {
        return result;
      } else {
        return false;
      }
    } catch (e) {
      log(e);
    }
  }

  async addMessage(data) {
    try {
      const randomuuid = v4();
      if (Object.keys(data).length < 4) {
        return false;
      }
      data["id"] = randomuuid;
      const row = new this.#model2(data);
      let result = await row.save();
      return result;
    } catch (e) {
      log(e);
      return false;
    }
  }
  async fetchMessages(from = "", to = "") {
    try {
      let data = [];
      if (from === "" && to === "") {
        return false;
      } else if (from === "" && to !== "") {
        // Retrieve messages to a specific person.
        const result = await this.#model2
          .find({ to: to })
          .sort({ date: 1 })
          .lean({ virtuals: true })
          .exec();
        result.forEach((element) => {
          let messagedata = {
            id: element.id,
            from: element.from,
            to: element.to,
            content: element.content,
            type: element.type,
            replay: element.replay,
            pin: element.pin,
            date: dataTime.timeToTimeZone(element.date),
            dateEdit: dataTime.timeToTimeZone(element.dateEdit),
          };
          data.push(messagedata);
        });

        return data;
      } else if (from !== "" && to === "") {
        // Retrieve messages from a specific person.
        const result = await this.#model2
          .find({ from: from })
          .sort({ date: 1 })
          .lean({ virtuals: true })
          .exec();

        result.forEach((element) => {
          let messagedata = {
            id: element.id,
            from: element.from,
            to: element.to,
            content: element.content,
            type: element.type,
            replay: element.replay,
            pin: element.pin,
            date: dataTime.timeToTimeZone(element.date),
            dateEdit: dataTime.timeToTimeZone(element.dateEdit),
          };
          data.push(messagedata);
        });

        return data;
      } else {
        const result = await this.#model2
          .find({ from: from, to: to })
          .sort({ date: 1 })
          .lean({ virtuals: true })
          .exec();

        result.forEach((element) => {
          let messagedata = {
            id: element.id,
            from: element.from,
            to: element.to,
            content: element.content,
            type: element.type,
            replay: element.replay,
            pin: element.pin,
            date: dataTime.timeToTimeZone(element.date),
            dateEdit: dataTime.timeToTimeZone(element.dateEdit),
          };
          data.push(messagedata);
        });
        return data;
      }
    } catch (e) {
      log(e);
      return false;
    }
  }
  async deleteMessage(id) {
    try {
      if (id) {
        const result = await this.#model2.deleteOne({ id: id });
        log(result);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      log(e);
      return false;
    }
  }
  arrayTokenToJson(arr) {
    const obj = { data: {} };
    for (let i = 0; i < arr.length; i += 1) {
      if (typeof arr[i] === "object") {
        let data = arr[i];
        for (let j = 0; j < data.length; j += 2) {
          let key = data[j];
          let value = data[j + 1];
          obj.data[key] = value;
        }
      } else if (i === 0) {
        obj.status = arr[i];
      } else {
        obj.token = arr[i];
      }
    }
  }
}

export default MessageModel;
