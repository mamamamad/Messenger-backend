/**
 * BaseController
 * --------------
 * Provides a base class for all controllers, including error handling logic.
 * All controllers should extend this class.
 */

import { log, getEnv } from "./utils.mjs";
import autoBind from "auto-bind";

/**
 * BaseController class for shared controller logic.
 */
export default class BaseController {
  constructor() {
    autoBind(this);
  }

  /**
   * Handles default errors for controllers.
   * @param {Error} error - The error object.
   * @param {object} res - Express response object.
   */
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
