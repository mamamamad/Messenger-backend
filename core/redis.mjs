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
  async delHash(key) {
    try {
      return await this.#ioredis.del(key);
    } catch (e) {
      log(e);
      return e.toString();
    }
  }
  async ftSearchUserToken(value) {
    // A function is created to build an FT index for FT.SEARCH in Redis, then the value is searched and the result is returned.
    try {
      if (!(await this.checkFtIndex("userToken"))) {
        await this.#ioredis.call(
          "FT.CREATE",
          "userToken",
          "ON",
          "HASH",
          "PREFIX",
          "1",
          "UserToken:",
          "SCHEMA",
          "id",
          "TEXT",
          "rT",
          "TEXT"
        );
      }

      const result = await this.#ioredis.call(
        "FT.SEARCH",
        "userToken",
        `@id:${value}`
      );

      if (result[0] === 0) return false;
      return result;
    } catch (e) {
      log(e);
    }
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
