import Redis from "ioredis";
import { log, getEnv } from "./utils.mjs";

/// a class for connect with redis db.  ///
class RedisClient {
  #ioredis;
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
      return await this.#ioredis.get(key);
    } catch (e) {
      log(e);
      return e.toString();
    }
  }
  async keys(key) {
    try {
      return await this.#ioredis.keys(key);
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
      return await this.#ioredis.hget(key, value);
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
}

const redis1 = new RedisClient();

export default { redis1 };
