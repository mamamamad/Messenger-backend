import Redis from "ioredis";
import { log, getEnv } from "./utils.mjs";

/// a class for connect with redis db.  ///
class RedisClient {
  #ioredis;
  #ftJwtIndex = null;
  constructor() {
    this.#ioredis = new Redis(getEnv("REDIS_URI"));
  }
  async set(key, value, ex = 0) {
    try {
      ex = ex <= 0 ? 0 : ex;
      if (ex) {
        return await this.#ioredis.set(key, value, "EX", ex);
      } else {
        return await this.#ioredis.set(key, value);
      }
    } catch (e) {
      log(e);
      return e.toString();
    }
  }
  async get(key) {
    try {
      let result = await this.#ioredis.get(key);
      if (result) {
        return result;
      } else {
        return "";
      }
    } catch (e) {
      log(e);
      return e.toString();
    }
  }
  async keys(key) {
    try {
      result = await this.#ioredis.keys(key);
      return result ? result : "";
    } catch (e) {
      log(e);
      return e.toString();
    }
  }
  async del(key) {
    try {
      return await this.#ioredis.del(key);
    } catch (e) {
      log(e);
      return e.toString();
    }
  }
  async setHash(key, values, ex) {
    try {
      ex = ex <= 0 ? 0 : ex;
      if (ex) {
        await this.#ioredis.hset(key, values);
        return await this.#ioredis.expire(key, ex);
      } else {
        return await this.#ioredis.hset(key, values);
      }
    } catch (e) {
      log(e);
      return e.toString();
    }
  }
  async getHash(key, value) {
    try {
      const result = await this.#ioredis.hget(key, value);
      return result ? result : "";
    } catch (e) {
      log(e);
      return e.toString();
    }
  }
  async getHashAll(key) {
    try {
      const result = await this.#ioredis.hgetall(key);
      return result ? result : "";
    } catch (e) {
      log(e);
      return e.toString();
    }
  }
  async delHash(key) {
    try {
      return await this.#ioredis.del(key);
    } catch (e) {
      log(e);
      return e.toString();
    }
  }
  async ftSearchUserTokenId(value) {
    // A function is created to build an FT index for FT.SEARCH in Redis, then the value is searched and the result is returned.
    try {
      if (!(await this.checkFtIndex("userTokenid"))) {
        await this.#ioredis.call(
          "FT.CREATE",
          "userTokenid",
          "ON",
          "HASH",
          "PREFIX",
          "1",
          "UserToken:",
          "SCHEMA",
          "id",
          "TEXT",
          "rT",
          "TEXT",
          "email",
          "TEXT"
        );
      }

      let result = await this.#ioredis.call(
        "FT.SEARCH",
        "userTokenid",
        `@id:${value}`
      );

      result = result.length === 0 ? false : this.arrayTokenToJson(result);
      return result;
    } catch (e) {
      log(e);
    }
  }
  async ftSearchUserTokenIdEmail(value) {
    // A function is created to build an FT index for FT.SEARCH in Redis, then the value is searched and the result is returned.
    try {
      if (!(await this.checkFtIndex("userTokenemail"))) {
        await this.#ioredis.call(
          "FT.CREATE",
          "userTokenemail",
          "ON",
          "HASH",
          "PREFIX",
          "1",
          "UserToken:",
          "SCHEMA",
          "id",
          "TEXT",
          "rT",
          "TEXT",
          "email",
          "TEXT"
        );
      }

      let result = await this.#ioredis.call(
        "FT.SEARCH",
        "userTokenemail",
        `@email:${value}`
      );
      result = result.length === 0 ? false : this.arrayTokenToJson(result);

      return result;
    } catch (e) {
      log(e);
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

    return obj;
  }
  async checkFtIndex(val) {
    try {
      const indexes = await this.#ioredis.call("FT._LIST");
      if (indexes.includes(val)) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
    }
  }
}

const redis1 = new RedisClient();

export default { redis1 };
