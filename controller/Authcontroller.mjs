/**
 * UserController
 * --------------
 * Handles user authentication and login logic.
 */

import { validationResult } from "express-validator";
import BaseController from "../core/Basecontroller.mjs";
import Redis from "../core/redis.mjs";
import {
  log,
  genaratorOtpToken,
  genaratorToken,
  getEnv,
} from "../core/utils.mjs";
import { MongoDb, UserModel } from "../globalMoudles.mjs";
import crypto from "../core/crypto.mjs";
import redis from "../core/redis.mjs";

/**
 * Controller for user authentication.
 */
class AuthController extends BaseController {
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
    // This function is used to log in a user, verify their email and password, and generate a JWT token for access token and a refresh token.
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
          const passwordIsValid = await crypto.checkArgonValid(
            userExist[0].password,
            password
          );
          if (passwordIsValid) {
            const data = await this.userModel.userExistEmail(email);
            var tokenExist = await redis.redis1.ftSearchUserTokenId(data[0].id);
            if (Object.keys(tokenExist).length > 1) {
              await redis.redis1.delHash(tokenExist.token);
              const { refreshToken, accessToken } = await this.#createToken({
                id: data[0].id,
                email: data[0].email,
              });
              res.cookie("accessToken", accessToken, {
                maxAge: 15 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain: getEnv("PATH_DOMAIN"),
                path: "/",
              });
              res.cookie("refreshToken", refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain: getEnv("PATH_DOMAIN"),
                path: "/",
              });
              return res.json({
                code: 1,
                msg: "login success",
              });
            } else {
              res.cookie("accessToken", accessToken, {
                maxAge: 15 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain: getEnv("PATH_DOMAIN"),
                path: "/",
              });
              res.cookie("refreshToken", refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain: getEnv("PATH_DOMAIN"),
                path: "/",
              });
              return res.json({
                code: 1,
                msg: "login success",
              });
            }
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
          domain: getEnv("PATH_DOMAIN"),
          path: "/",
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
  async #createToken(data) {
    try {
      const refreshToken = genaratorToken(40);
      const accessToken = crypto.jwtGenerator({ email: data.email });
      let refreshtokenData = {};
      Object.entries(data).map(([key, val]) => {
        refreshtokenData[key] = val;
      });
      refreshtokenData["rT"] = refreshToken;
      refreshtokenData["email"] = crypto.stringtoBase64(refreshtokenData.email);
      let result = await redis.redis1.setHash(
        `UserToken:${refreshToken}`,
        refreshtokenData,
        561600
      );

      return { refreshToken, accessToken };
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
      log("hi");
      const { Fname, Lname, username, email, pass1, pass2 } = req.body;
      const existEmailemail = await this.userModel.userExistEmail(email);
      const existEmailusername = await this.userModel.userExistUsername(
        username
      );

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
  async refreshToken(req, res) {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(403).json({
          code: 0,
          msg: "fail login",
          error: err.errors.map((e) => e.msg),
        });
      }
      const refreshToken = req.cookies.refreshToken;

      let existToken = await redis.redis1.getHashAll(
        `UserToken:${refreshToken}`
      );
      const userData = await this.userModel.userExistId(existToken.id);
      if (Object.keys(existToken).length) {
        const accessToken = crypto.jwtGenerator(userData[0].email);
        res.cookie("accessToken", accessToken, {
          maxAge: 15 * 60 * 1000,
          httpOnly: true,
          secure: true,
          sameSite: "none",
          domain: getEnv("PATH_DOMAIN"),
          path: "/",
        });
        res.json({ code: 1 });
      } else {
        res.status(400).json({ code: 0, msg: "Refresh Token is not find" });
      }
    } catch (e) {
      log(e);
    }
  }
  async logOut(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      let existToken = await redis.redis1.getHashAll(
        `UserToken:${refreshToken}`
      );
      if (Object.keys(existToken).length) {
        await redis.redis1.delHash(`UserToken:${refreshToken}`);
        res.clearCookie.json({ code: 1, msg: "log out." });
      } else {
        res.json({ code: 0, msg: "the Token is not exist." });
      }
    } catch (e) {
      log(e);
    }
  }
}
export default AuthController;
