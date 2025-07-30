import crypto from "crypto";
import { log, getEnv, setEnv } from "./utils.mjs";
import { json } from "stream/consumers";

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
}

export default new Crypto();
