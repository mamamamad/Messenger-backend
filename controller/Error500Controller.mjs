/**
 * Error500Controller
 * -----------------
 * Handles 500 (Internal Server Error) errors for the application.
 */

import BaseController from "../core/Basecontroller.mjs";
import { log } from "../core/utils.mjs";

/**
 * Controller for handling 500 errors.
 */
class Eroor500 extends BaseController {
  constructor() {
    super();
  }

  /**
   * Handles 500 errors.
   * @param {Error} err - Error object.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {function} next - Express next middleware function.
   */
  async handle(err, req, res, next) {
    try {
      return res.status(500).json({ error: "Internall Error" });
    } catch (e) {
      return this.defaultError(e, res);
    }
  }
}

export default new Eroor500();
