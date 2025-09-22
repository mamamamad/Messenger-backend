import jwt from "jsonwebtoken";
import { getEnv } from "../core/utils.mjs";

import { log } from "../core/utils.mjs";
import redis from "../core/redis.mjs";
import crypto from "../core/crypto.mjs";

export async function authJwt(req, res, next) {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });
    const secretKey = getEnv("SECRET_KEY_JWT");
    let decoded = null;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Malformed token" });
      } else if (err.name === "NotBeforeError") {
        return res.status(401).json({ error: "Token not active yet" });
      } else {
        return res.status(401).json({ error: "Invalid token" });
      }
    }

    const base64Code = crypto.stringtoBase64(decoded.email);
    let existRefreshToken = await redis.redis1.ftSearchUserTokenIdEmail(
      base64Code
    );

    if (base64Code === existRefreshToken.data.email) {
      req.userEmail = decoded.email;
      return next();
    }
    return res.status(401).json({ error: "Invalid token" });
  } catch (error) {
    log(error);
    return res.status(401).json({ error: "Invalid token" });
  }
}

export async function authJwtAdmin(req, res, next) {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(401)
        .render("pages/login", { errors: ["Access denied"] });
    const secretKey = getEnv("SECRET_KEY_JWT");
    let decoded = null;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .render("pages/login", { errors: ["token Expired"] });
      } else if (err.name === "JsonWebTokenError") {
        return res
          .status(401)
          .render("pages/login", { errors: ["Malformed token"] });
      } else if (err.name === "NotBeforeError") {
        return res
          .status(401)
          .render("pages/login", { errors: ["Invalid token"] });
      } else {
        log(err);
        return res
          .status(401)
          .render("pages/login", { errors: ["Invalid token"] });
      }
    }

    const base64Code = crypto.stringtoBase64(decoded.email);
    let existRefreshToken = await redis.redis1.ftSearchAdminTokenIdEmail(
      base64Code
    );

    if (base64Code === existRefreshToken.data.email) {
      req.adminEmail = decoded.email;
      req.level = decoded.level;

      return next();
    }
    return res.status(401).render("pages/login", { errors: ["Invalid token"] });
  } catch (error) {
    log(error);
    return res.status(401).render("pages/login", { errors: ["Invalid token"] });
  }
}
