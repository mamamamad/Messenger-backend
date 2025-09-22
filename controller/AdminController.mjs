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
import { MongoDb, AdminModel } from "../globalMoudles.mjs";
import crypto from "../core/crypto.mjs";
import redis from "../core/redis.mjs";

/**
 * Controller for user authentication.
 */
class AdminController extends BaseController {
  constructor() {
    super();
    this.userModel = AdminModel;
  }

  /**
   * Placeholder for login check logic.
   */

  /**
   * Handles user login.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async adminLogin(req, res) {
    // This function is used to log in a user, verify their email and password, and generate a JWT token for access token and a refresh token.
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res
          .status(400)
          .render("pages/login", { errors: err.errors.map((e) => e.msg) });
      }
      const { email, password } = req.body;

      let adminExist = await this.userModel.adminExistEmail(email);
      if (adminExist) {
        const passwordIsValid = await crypto.checkArgonValid(
          adminExist[0].password,
          password
        );
        if (passwordIsValid) {
          var tokenExist = await redis.redis1.ftSearchAdminTokenId(
            adminExist[0].id
          );
          if (Object.keys(tokenExist).length > 1) {
            await redis.redis1.delHash(tokenExist.token);
          }

          const { refreshToken, accessToken } = await this.#createToken({
            id: adminExist[0].id,
            email: adminExist[0].email,
            level: adminExist[0].level,
          });
          res.cookie("accessToken", accessToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: getEnv("PATH_DOMAIN"),
            path: "/pan",
          });
          res.cookie("refreshToken", refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: getEnv("PATH_DOMAIN"),
            path: "/pan",
          });
          return res.redirect("/pan/dashboard");
        } else {
          return res.status(401).render("pages/login", {
            errors: ["Username or Password inValid."],
          });
        }
      } else {
        return res
          .status(401)
          .render("pages/login", { errors: ["Username or Password inValid."] });
      }
    } catch (e) {
      log(e);
    }
  }

  async AdminPage(req, res) {
    try {
      const admins = await this.userModel.allAdmin();
      if (admins) {
        res.render("pages/dashboard/addadmin.njk", {
          admins,
        });
      } else {
        res.render("pages/dashboard/addadmin.njk", {
          errors: ["admin Not Found"],
        });
      }
    } catch (e) {
      log(e);
    }
  }
  async dashboard(req, res) {
    try {
      const result = await this.userModel.adminExistEmail(req.adminEmail);
      log(res.locals);
      return res.render("pages/dashboard.njk", {});
    } catch (e) {
      log(e);
    }
  }

  async addAdmin(req, res) {
    try {
      const { nickname, password1, password2, email, level } = req.body;
      return res.render("pages/dashboard.njk", {});
    } catch (e) {
      log(e);
    }
  }

  async #addAdmin(email1, nickName1, password1, level1) {
    try {
      let emailExist = await this.userModel.adminExistEmail(email1);
      if (emailExist) {
        return "the email is exist";
      } else {
        const hashPassword = await crypto.hashArogo2(password1);
        const data = {
          email: email1,
          nickName: nickName1,
          password: hashPassword,
          level: level1,
        };
        let result = await this.userModel.addAdmin(data);
        log(result);
        if (result.email === email1) {
          return "User Created Successfully";
        } else {
          return "An error occurred during registration.";
        }
      }
    } catch (e) {
      log(e);
    }
  }
  async #createToken(data) {
    try {
      const refreshToken = genaratorToken(40);
      const accessToken = crypto.jwtGenerator({
        email: data.email,
        level: data.level,
      });
      let refreshtokenData = {};
      Object.entries(data).map(([key, val]) => {
        refreshtokenData[key] = val;
      });
      refreshtokenData["rT"] = refreshToken;
      refreshtokenData["email"] = crypto.stringtoBase64(refreshtokenData.email);
      let result = await redis.redis1.setHash(
        `adminToken:${refreshToken}`,
        refreshtokenData,
        561600
      );

      return { refreshToken, accessToken };
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
      const refreshToken = req.body.RefreshToken;

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
        `adminToken:${refreshToken}`
      );
      log(existToken);
      if (Object.keys(existToken).length) {
        log(existToken);
        await redis.redis1.delHash(`adminToken:${refreshToken}`);
        res.render("pages/login", { errors: ["Logout."] });
      } else {
        res.render("pages/login", { errors: ["the Token is not exist."] });
      }
    } catch (e) {
      log(e);
    }
  }
  async initSuperAdmin() {
    try {
      const email = getEnv("SUPERADMIN_EMAIL");
      const password = getEnv("SUPERADMIN_PASSWORD");
      let emailExist = await this.userModel.adminExistEmail(email);
      if (emailExist) {
        log("the Super admin is created.");
        return false;
      } else {
        const result = await this.#addAdmin(email, "LoardSisi", password, 1);
        return result;
      }
    } catch (e) {
      log(e);
    }
  }
}
export default AdminController;
