/**
 * UserController
 * --------------
 * Handles user authentication and login logic.
 */
import { encode } from "html-entities";
import { validationResult } from "express-validator";
import BaseController from "../core/Basecontroller.mjs";
import Redis from "../core/redis.mjs";
import { log, genaratorOtpToken, genaratorToken } from "../core/utils.mjs";

import { UserModel } from "../globalMoudles.mjs";
import crypto from "../core/crypto.mjs";
import redis from "../core/redis.mjs";

/**
 * Controller for  User Profile.
 */
class ProfileController extends BaseController {
  constructor() {
    super();
    this.userModel = UserModel;
  }

  async profile(req, res) {
    res.json({ msg: "ok" });
  }
}
export default ProfileController;
