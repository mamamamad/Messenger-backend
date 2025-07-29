import BaseController from "../core/Basecontroller.mjs";
import { log } from "../core/utils.mjs";

class Eroor500 extends BaseController {
  constructor() {
    super();
  }
  async handle(err, req, res, next) {
    try {
      return res.status(500).json({ error: "Internall Error" });
    } catch (e) {
      return this.defaultError(e, res);
    }
  }
}

export default new Eroor500();
