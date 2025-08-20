/**
 * Crypto
 * ------
 * Provides encryption and decryption utilities using AES-256-CBC.
 * Uses a secret key from environment variables.
 */

import crypto, { hash } from "crypto";
import { log, getEnv, setEnv, genaratorToken } from "./utils.mjs";
import { json } from "stream/consumers";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import redis from "./redis.mjs";

/**
 * Crypto class for encrypting and decrypting data.
 */
class Crypto {
  #algorithm = "aes-256-cbc";
  #key = "";
  #iv = "";
  constructor() {
    try {
      this.#key = crypto
        .createHash("sha256")
        .update(getEnv("SECRET_KEY_ENCRYPT"))
        .digest("hex")
        .substring(0, 32);
      this.#iv = crypto.randomBytes(16);

      setEnv("IV", this.#iv.toString("hex"));
    } catch (e) {
      log(e.toString());
    }
  }

  /**
   * Encrypts the given data.
   * @param {any} data - Data to encrypt.
   * @returns {string} Encrypted string.
   */
  encrypt(data) {
    try {
      const chiper = crypto.createCipheriv(
        this.#algorithm,
        Buffer.from(this.#key),
        this.#iv
      );
      data = { x: Math.random(), data: data, y: Math.random() };
      let encrypted = chiper.update(JSON.stringify(data), "utf8", "hex");
      encrypted += chiper.final("hex");

      return encrypted;
    } catch (error) {
      log(error);
    }
  }

  /**
   * Decrypts the given encrypted string.
   * @param {string} encrypted - Encrypted string.
   * @returns {any} Decrypted data.
   */
  decrypt(encrypted) {
    try {
      const decipher = crypto.createDecipheriv(
        this.#algorithm,
        Buffer.from(this.#key),
        Buffer.from(this.#iv, "hex")
      );
      let decrypted = decipher.update(encrypted, "hex", "utf-8");
      decrypted += decipher.final("utf-8");
      return JSON.parse(decrypted).data;
    } catch (e) {
      log(e);
    }
  }
  async hashArogo2(password) {
    const result = await argon2.hash(password);
    return result;
  }
  async checkHashValid(hash, value) {
    try {
      const result = await argon2.verify(hash, value);
      return result;
    } catch (e) {
      log(e);
    }
  }
  stringtoBase64(value) {
    try {
      return btoa(value);
    } catch (e) {
      log(e);
    }
  }
  base64ToString(valus) {
    try {
      return atob(valus);
    } catch (e) {
      log(e);
    }
  }
  jwtGenerator(data) {
    //  In this function, a JWT token is created with specific data and saved in Redis with a random ID. This ID is unique for each user.
    try {
      let JwtSecret = getEnv("SECRET_KEY_JWT");
      const token = jwt.sign({ email: data }, JwtSecret, {
        expiresIn: "15m",
      });
      return token;
    } catch (e) {
      log(e);
    }
  }
}

export default new Crypto();
