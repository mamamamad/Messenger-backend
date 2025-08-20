import jwt from "jsonwebtoken";
import { getEnv } from "../core/utils.mjs";
import { UserModel } from "../globalMoudles.mjs";
import { log } from "../core/utils.mjs";

export async function authJwt(req, res, next) {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });
    const secretKey = getEnv("SECRET_KEY_JWT");
    const decoded = jwt.verify(token, secretKey);
    const userId = await UserModel.userExistEmail(decoded.email);

    req.userId = userId[0].email;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
