import dotenv from "dotenv";
import BaseController from "./Basecontroller.mjs";
import fs from "fs";
dotenv.config();

export function log(obj) {
  console.log(obj);
}
export function getEnv(obj, Type = "string") {
  try {
    if (process.env[obj] !== "" && process.env[obj] !== undefined) {
      switch (Type) {
        case "number":
          return process.env[obj];
        case "bool":
          return process.env[obj] === "0" ? false : true;
        default:
          return process.env[obj];
      }
    } else {
      return null;
    }
  } catch (e) {
    log(e);
  }
}
export function setEnv(key, value) {
  try {
    if (getEnv(key) === undefined) {
      const content = `${key}=${value}\n`;
      fs.writeFileSync(".env", content);
    } else {
      const envContent = fs.readFileSync(".env", "utf-8");
      const updatedContent = envContent
        .split("\n")
        .filter((line) => !line.trim().startsWith(`${key}=`))
        .concat(`${key}=${value}`)
        .join("\n");

      fs.writeFileSync(".env", updatedContent);
    }
  } catch (e) {
    log(e.toString());
  }
}
