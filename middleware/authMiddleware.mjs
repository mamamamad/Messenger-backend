import jwt from "jsonwebtoken";
import { getEnv } from "../core/utils.mjs";
export function authJwt(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const secretKey = getEnv("SECRET_KEY_JWT");
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
