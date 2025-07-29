import { validationResult } from "express-validator";
import users from "./../module/user_login.mjs";
import BaseController from "../core/Basecontroller.mjs";
import { log } from "../core/utils.mjs";

class Usercontroller extends BaseController {
  constructor() {
    super();
  }

  checkLogin() {}
  async userLogin(req, res) {
    try {
      log("hi");
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(400).json({
          status: false,
          cookie_id: null,
          error: err.array(),
        });
      }
      const { email, password } = req.body;
      const userdata = users.find(
        (u) => u.email === email && u.password === password
      );
      if (userdata) {
        return res
          .status(200)
          .json({ status: true, cookie_id: "seession", error: null });
      } else {
        return res.status(401).json({
          status: false,
          cookie_id: null,
          error: "usename or password incorrect",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(501).json({
        error: "internal error ,Please Refresh page",
        status: false,
        cookie_id: null,
      });
    }
  }
}

export default new Usercontroller();
