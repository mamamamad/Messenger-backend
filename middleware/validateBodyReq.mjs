/* this fnction use for checking the keys in json for prevent mass assigment  */
import BaseMiddleware from "./BaseMiddleware.mjs";
import { log } from "../core/utils.mjs";
export default class validateBody extends BaseMiddleware {
  #allowedFields = null;
  constructor(allowedFields) {
    super();
    this.#allowedFields = allowedFields;
  }

  handle(req, res, next) {
    try {
      if (req.body == null) {
        return this.toError("Request body is empty.", req, res);
      }
      Object.keys(req.body).forEach((element) => {
        if (!this.#allowedFields.includes(element)) {
          delete req.body[element];
        }
      });
      next();
    } catch (e) {
      log(e);
      return this.toError(e, req, res);
      next();
    }
  }
}
