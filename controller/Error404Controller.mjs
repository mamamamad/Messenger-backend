import BaseController from "../core/Basecontroller.mjs";
import { log } from "../core/utils.mjs";

class Eroor404 extends BaseController {
  constructor() {
    super();
  }
  async handle(req, res, next) {
    try {
      return res.status(404).json({ error: "Page Not Found." });
    } catch (e) {
      return this.defaultError(e, res);
    }
  }
}

export default new Eroor404();
