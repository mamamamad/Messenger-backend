/**
 * UserController
 * --------------
 * Handles user authentication and login logic.
 */
import { encode } from "html-entities";
import { validationResult } from "express-validator";

import BaseController from "../core/Basecontroller.mjs";
import Redis from "./../core/redis.mjs";
import { log, genaratorOtpToken, genaratorCookie } from "../core/utils.mjs";

import { UserModel } from "../globalMoudles.mjs";
import crypto from "../core/crypto.mjs";

/**
 * Controller for user authentication.
 */
export default class Usercontroller extends BaseController {
  constructor() {
    super();
    this.userModel = UserModel;
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
    // This function is used to log in a user, verify their email and password, and generate a JWT token for them.
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(403).json({
          code: 0,
          msg: "fail login",
          error: err.errors.map((e) => e.msg),
        });
      }
      const { email, password } = req.body;

      let userExist = await this.userModel.userExistEmail(email);

      if (userExist) {
        if (userExist[0].status) {
          const passwordIsValid = await crypto.checkHashValid(
            userExist[0].password,
            password
          );
          if (passwordIsValid) {
            return res.json({ code: 1, msg: "login success" });
            //add jwt token
          } else {
            return res.status(400).json({
              code: 0,
              msg: "the username or password invalid.",
            });
          }
        } else {
          return res.status(401).json({
            code: 0,
            msg: "the username is blocked",
          });
        }
      } else {
        return res.status(400).json({
          code: 0,
          msg: "the username or password invalid.",
        });
      }
    } catch (err) {
      super.defaultError(err, req, res);
    }
  }

  async sendOtp(req, res) {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(403).json({
          code: 0,
          msg: "fail login",
          error: err.errors.map((e) => e.msg),
        });
      }
      const email = req.body.email;

      if ((await this.emailExist(email)) === true) {
        let exist = [];
        let key, token;
        do {
          token = genaratorOtpToken();
          key = `ResetPassword:${token}`;
          exist = await Redis.redis1.keys(`*${token}`);
        } while (exist.length !== 0);
        await Redis.redis1.setHash(key, { otp: token, email: email }, 90);
        return res.status(200).json({
          error: null,
          status: "success",
        });
      } else {
        return res.status(404).json({
          error: "email Not Exist.",
          msg: "fail login",
        });
      }
    } catch (e) {
      log(e);
    }
  }
  async verifyOtp(req, res) {
    try {
      const { email, otpCode } = req.body;
      const key = `ResetPassword:${otpCode}`;
      // wait for otp and phonenumber athentication
      if (
        (await Redis.redis1.getHash(key, "otp")) === otpCode &&
        (await Redis.redis1.getHash(key, "email")) === email
      ) {
        let cookie = null;
        let key_cookie = null;
        // check the cookie if exsits create again.
        do {
          cookie = genaratorCookie(10);
          key_cookie = `RPCookie:${cookie}`;
          let exist = Redis.redis1.keys(`*${key_cookie}`);
        } while (exist.length !== 1);

        // ResetPasswordCookie
        await Redis.redis1.delHash(key);
        let x = await Redis.redis1.setHash(
          key_cookie,
          { cookie: cookie, email: email },
          300
        );
        //set cookie for otp code
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
          msg: "fail login",
        });
      }
    } catch (e) {
      log(e);
    }
  }
  async forgetPassword(req, res) {
    try {
      //check if eroor exist send to front
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(403).json({
          code: 0,
          msg: "fail login",
          error: err.errors.map((e) => e.msg),
        });
      }
      // check for set cookie
      const cookieMyValue = req.cookies.otpCookie;
      if (cookieMyValue === undefined) {
        return res.status(401).json({
          msg: "fail login",
          error: "Not Authorized",
        });
      }

      const phoneNumber = req.body.phoneNumber;
      const pass = req.body.pass1;
      const passAgain = req.body.pass2;
      const key = `RPCookie:${cookieMyValue}`;
      // check the exist user phone number and cookie in redis db
      if (
        (await Redis.redis1.getHash(key, "cookie")) === cookieMyValue &&
        (await Redis.redis1.getHash(key, "phoneNumber")) === phoneNumber
      ) {
        if (pass === passAgain) {
          // fixed the code.
          await Redis.redis1.delHash(key);
          res.clearCookie("otpCookie");
          res.status(200).json({
            status: "success",
            error: "Null",
            message: "Password Changed.",
          });
        } else {
          res
            .status(400)
            .json({ msg: "fail login", error: "Passwords Do Not atch." });
        }
      } else {
        return res.status(401).json({
          msg: "fail login",
          error: "Not Authorized",
        });
      }
    } catch (e) {
      log(e);
    }
  }

  async register(req, res) {
    try {
      //This function is used to register a user, verify their information, and save it to the database.
      //check if eroor exist send to front
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(403).json({
          code: 0,
          msg: "fail login",
          error: err.errors.map((e) => e.msg),
        });
      }
      const { Fname, Lname, username, email, pass1, pass2 } = req.body;
      const existEmailemail = await this.userModel.userExistEmail(email);
      const existEmailusername = await this.userModel.userExistUsername(
        username
      );
      log(existEmailemail);
      log(existEmailusername);
      if (!existEmailusername && !existEmailemail) {
        if (pass1 === pass2) {
          const hashPassword = await crypto.hashArogo2(pass2);
          const data = {
            Fname: Fname,
            Lname: Lname,
            username: username,
            email: email,
            password: hashPassword,
          };
          const result = await this.userModel.addUser(data);
          if (result.email === email) {
            return res.json({ code: 1, msg: "User Created Successfully" });
          } else {
            return res.status(400).json({
              code: 0,
              msg: "An error occurred during registration",
            });
          }
        } else {
          return res.status(400).json({
            code: 0,
            msg: "the passwords is not match.",
          });
        }
      } else {
        return res.status(400).json({
          code: 0,
          msg: "the username or email is already use.",
        });
      }
    } catch (e) {
      log(e);
    }
  }
}
