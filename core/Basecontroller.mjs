import { log } from "./utils.mjs";
import autoBind from "auto-bind";

export default class BaseController {
  constructor() {
    autoBind(this);
  }

  defaultError(error, res) {
    try {
      log(error);
      res.status(500).json({ error: "Internal Eroor." });
    } catch (err) {
      log(err);
      res.status(500).json({ error: "Internal Eroor." });
    }
  }
}
