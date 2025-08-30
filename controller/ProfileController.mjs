/**
 * UserController
 * --------------
 * Handles user authentication and login logic.
 */

import { validationResult } from "express-validator";
import BaseController from "../core/Basecontroller.mjs";
import { log, getEnv } from "../core/utils.mjs";
import multer from "multer";
import { UserModel } from "../globalMoudles.mjs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import util from "util";
import crypto from "../core/crypto.mjs";
import redis from "../core/redis.mjs";

/**
 * Controller for  User Profile.
 */
class ProfileController extends BaseController {
  #storage;
  #upload;
  __dirname;
  constructor() {
    try {
      super();
      this.userModel = UserModel;
      this.__dirname = getEnv("BASE_PATH");
      this.#storage = multer.diskStorage({
        destination: path.join(this.__dirname, "/media/avatars/"),
        filename: function (req, file, cb) {
          cb(null, Date.now() + path.extname(file.originalname));
        },
      });
      this.#upload = multer({
        storage: this.#storage,
        limits: { fileSize: 10000000 }, // 10MB file size limit
        fileFilter: this.fileFilter,
      }).single("Profile");
      this.uploadMiddleware = util.promisify(this.#upload);
    } catch (e) {
      log(e);
    }
  }
  fileFilter(req, file, cb) {
    try {
      const allowedExtensions = /jpeg|jpg|png/;

      const extname = allowedExtensions.test(
        path.extname(file.originalname).toLowerCase()
      );

      const mimetype = allowedExtensions.test(file.mimetype);

      if (mimetype && extname) {
        cb(null, true);
      } else {
        cb(new Error("Only images are allowed (jpeg, jpg, png)"));
      }
    } catch (e) {
      log(e);
    }
  }
  async profile(req, res) {
    try {
      const userEmail = req.userEmail;
      const result = await this.userModel.userExistEmail(userEmail);
      const userData = {
        email: result[0].email,
        Fname: result[0].Fname,
        Lname: result[0].Lname,
        avatar: result[0].avatar,
        username: result[0].username,
      };
      res.json({ userData });
    } catch (e) {
      log(e);
    }
  }
  async uploadProfilePicture(req, res) {
    try {
      //  function that uploads a profile picture and deletes the previous one if it exists
      try {
        //check the error for file mimetype and filetype.
        await this.uploadMiddleware(req, res);
      } catch (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ code: 0, msg: err.message });
        }
      }

      if (!req.file) {
        return res.status(400).json({ code: 0, msg: "file not exist" });
      }
      let pathAvatar = "/media/avatars/" + req.file.filename;
      const userData = await this.userModel.userExistEmail(req.userEmail);
      var resultUpload = null;
      if (userData[0].avatar === "/media/avatars/defualt.png") {
        resultUpload = await this.userModel.updateValue(
          { email: req.userEmail },
          { avatar: pathAvatar }
        );
      } else {
        resultUpload = await this.userModel.updateValue(
          { email: req.userEmail },
          { avatar: pathAvatar }
        );
        fs.unlink(this.__dirname + userData[0].avatar, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return;
          }
          console.log("File deleted successfully");
        });
      }

      if (resultUpload.nModified || resultUpload.nModified === 1) {
        return res.json({ code: 1, msg: "The profile is uploaded." });
      }
      return res
        .status(400)
        .json({ code: 0, msg: "The profile is not uploaded." });
    } catch (e) {
      log(e);
    }
  }
  async deleteProfilePicture(req, res) {
    try {
      let resultUpload = null;
      const userData = await this.userModel.userExistEmail(req.userEmail);
      if (userData[0].avatar !== "/media/avatars/defualt.png") {
        resultUpload = await this.userModel.updateValue(
          { email: req.userEmail },
          { avatar: "/media/avatars/defualt.png" }
        );
        fs.unlink(this.__dirname + userData[0].avatar, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return;
          }
          console.log("File deleted successfully");
        });
        res.json({ code: 1, msg: "Profile deleted." });
      } else {
        res.json({ code: 0, msg: "you dont have a picture profile." });
      }
    } catch (e) {
      log(e);
    }
  }
  async updatePersonalData(req, res) {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(403).json({
          code: 0,
          msg: "fail login",
          error: err.errors.map((e) => e.msg),
        });
      }
      let fields = req.body;
      Object.keys(fields).forEach((field) => {
        if (!req.body[field]) {
          delete fields[field];
        }
      });
      if (Object.keys(fields).length === 0) {
        return res.status(403).json({
          code: 0,
          msg: "No data available for update",
        });
      } else {
        const usernameExist = await this.userModel.userExistUsername(
          fields.username
        );
        log(usernameExist);
        if (usernameExist && req.userEmail !== usernameExist[0].email) {
          return res.json({
            code: 0,
            msg: "the username is exist.",
          });
        }

        let key = { email: req.userEmail };
        const result = await this.userModel.updateValue(key, fields);

        if (result.modifiedCount === 1) {
          return res.json({
            code: 1,
            msg: "the Profile updated",
          });
        } else if (result.modifiedCount === 0) {
          return res.json({
            code: 0,
            msg: "The data you provided already exists.",
          });
        } else {
          return res.json({
            code: 0,
            msg: "error please again.",
          });
        }
      }
    } catch (e) {
      log(e);
    }
  }
  async changEmail(req, res) {
    // This function checks if the new email does not exist and the password is correct, then it changes the email and sets the new one.
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(403).json({
          code: 0,
          msg: "fail login",
          error: err.errors.map((e) => e.msg),
        });
      }
      const { newEmail, password } = req.body;
      let existNewEmail = await this.userModel.userExistEmail(newEmail);
      log(req.userEmail);
      if (existNewEmail) {
        return res
          .status(400)
          .json({ code: 0, msg: "the new email is exist." });
      }
      if (req.userEmail) {
        const resultUser = await this.userModel.userExistEmail(req.userEmail);
        const verifyPass = await crypto.checkArgonValid(
          resultUser[0].password,
          password
        );

        if (verifyPass) {
          const result = await this.userModel.updateValue(
            { email: req.userEmail },
            { email: newEmail }
          );
          if (result.modifiedCount === 1) {
            this.clearToken(req.userEmail);
            if (result) {
              return res.json({ code: 1, msg: "the email is changed." });
            }
            return res
              .status(400)
              .json({ code: 0, msg: "the operations error." });
          } else {
            return res
              .status(400)
              .json({ code: 0, msg: "the operations error." });
          }
        } else {
          return res
            .status(400)
            .json({ code: 0, msg: "the Password in wrong." });
        }
      } else {
        return res.status(400).json({ code: 0, msg: "the Email not found." });
      }
    } catch (e) {
      log(e);
    }
  }
  async clearToken(email) {
    try {
      let existUser = await redis.redis1.ftSearchUserTokenIdEmail(
        crypto.stringtoBase64(email)
      );
      let result = await redis.redis1.delHash(existUser.token);
      if (Object.keys(result).length > 1) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      log(e);
    }
  }
}

export default ProfileController;
