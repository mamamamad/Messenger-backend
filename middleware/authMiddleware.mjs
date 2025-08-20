import jwt from "jsonwebtoken";
import { getEnv } from "../core/utils.mjs";
import { UserModel } from "../globalMoudles.mjs";
import { log } from "../core/utils.mjs";
import redis from "../core/redis.mjs";
import crypto from "../core/crypto.mjs";

export async function authJwt(req, res, next) {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });
    const secretKey = getEnv("SECRET_KEY_JWT");
    const decoded = jwt.verify(token, secretKey);
    const base64Code = crypto.stringtoBase64(decoded.email);
    let existRefreshToken = await redis.redis1.ftSearchUserTokenIdEmail(
      base64Code
    );
    if (base64Code === existRefreshToken[2][5]) {
      return next();
    }
    return res.status(401).json({ error: "Invalid token" });
  } catch (error) {
    log(error);
    return res.status(401).json({ error: "Invalid tolken" });
  }
}
