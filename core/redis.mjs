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
      result = await this.#ioredis.hget(key, value);
      return result ? result : "";
    } catch (e) {
      log(e);
      return e.toString();
    }
  }
  async delHash(key, value) {
    try {
      return await this.#ioredis.del(key);
    } catch (e) {
      log(e);
      return e.toString();
    }
  }
  async ftSearchJwtToken(value) {
    // A function is created to build an FT index for FT.SEARCH in Redis, then the value is searched and the result is returned.
    try {
      if (!this.#ftJwtIndex) {
        await this.#ioredis.call(
          "FT.CREATE",
          "userToken",
          "ON",
          "HASH",
          "PREFIX",
          "1",
          "Usertoke:",
          "SCHEMA",
          "id",
          "TEXT",
          "email",
          "TEXT"
        );
      }

      const result = await this.#ioredis.call(
        "FT.SEARCH",
        "userToken",
        `@id:${value}`
      );

      return result;
    } catch (e) {
      log(e);
    }
  }
}

const redis1 = new RedisClient();

export default { redis1 };
