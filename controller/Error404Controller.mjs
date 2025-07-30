/**
 * Error404Controller
 * -----------------
 * Handles 404 (Not Found) errors for the application.
 */

import BaseController from "../core/Basecontroller.mjs";
import { log } from "../core/utils.mjs";

/**
 * Controller for handling 404 errors.
 */
class Eroor404 extends BaseController {
  constructor() {
    super();
  }

  /**
   * Handles 404 errors.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {function} next - Express next middleware function.
   */
  async handle(req, res, next) {
    try {
      return res.status(404).json({ error: "Page Not Found." });
    } catch (e) {
      return this.defaultError(e, res);
    }
  }
}

export default new Eroor404();
