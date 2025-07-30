import { log, getEnv } from "./utils.mjs";
import autoBind from "auto-bind";

export default class BaseController {
  constructor() {
    autoBind(this);
  }

  defaultError(error, res) {
    try {
      if (getEnv("DEBUG", "bool")) {
        return res.status(500).json({ error: "Internal Server Eroor." });
      } else {
        res.status(500).json({ error: `${error}` });
      }
    } catch (err) {
      if (getEnv("DEBUG", "bool")) {
        log(err);
        return res.status(500).json({ error: "Internal Server Eroor." });
      } else {
        log(err);
        res.status(500).json({ error: `${err}` });
      }
    }
  }
}
