/**
 * UserController
 * --------------
 * Handles user authentication and login logic.
 */

import { validationResult } from "express-validator";
import users from "./../module/user_login.mjs";
import BaseController from "../core/Basecontroller.mjs";
import Redis from "./../core/redis.mjs";
import { log, genaratorOtpToken, genaratorCookie } from "../core/utils.mjs";
import { status } from "@grpc/grpc-js";

/**
 * Controller for user authentication.
 */
class Usercontroller extends BaseController {
  constructor() {
    super();
  }

  /**
   * Placeholder for login check logic.
   */
  checkLogin() {}

  /**
   * Handles user login.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async userLogin(req, res) {
    try {
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
  async phoneExist(phoneNum) {
    /**a functions check the phone number exist or no */
    const result = users.find((pn) => pn.PhoneNumber === phoneNum);
    if (result) {
      return true;
    } else {
      return false;
    }
  }
  async sendOtp(req, res) {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(403).json({
          status: "fail",
          error: err.errors[0]["msg"],
        });
      }
      const numPhone = req.body.phoneNumber;

      if ((await this.phoneExist(numPhone)) === true) {
        let exist = [];
        let key, token;
        do {
          token = genaratorOtpToken();
          key = `ResetPassword:${token}`;
          exist = await Redis.redis1.keys(`*${token}`);
        } while (exist.length !== 0);
        await Redis.redis1.setHash(
          key,
          { otp: token, phoneNumber: numPhone },
          90
        );
        log(token);
        return res.status(200).json({
          error: null,
          status: "success",
        });
      } else {
        return res.status(404).json({
          error: "Number Phone Not Exist.",
          status: "fail",
        });
      }
    } catch (e) {
      log(e);
    }
  }
  async verifyOtp(req, res) {
    try {
      const { phoneNumber, otpCode } = req.body;
      const key = `ResetPassword:${otpCode}`;

      if (
        (await Redis.redis1.getHash(key, "otp")) === otpCode &&
        (await Redis.redis1.getHash(key, "phoneNumber")) === phoneNumber
      ) {
        const cookie = genaratorCookie(10);
        const key_cookie = `RPCookie:${cookie}`;
        await Redis.redis1.setHash(
          key,
          { cookie: key_cookie, phoneNumber: phoneNumber },
          300
        );

        res.cookie("otpCookie", cookie, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 5,
          sameSite: "Strict",
        });
        return res.status(200).json({
          error: null,
          status: "success",
        });
      } else {
        return res.status(404).json({
          error: null,
          status: "fail",
        });
      }
    } catch (e) {
      log(e);
    }
  }
}

export default new Usercontroller();
