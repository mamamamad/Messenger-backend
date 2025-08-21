/**
 * UserController
 * --------------
 * Handles user authentication and login logic.
 */
import { encode } from "html-entities";
import { validationResult } from "express-validator";
import BaseController from "../core/Basecontroller.mjs";
import Redis from "../core/redis.mjs";
import {
  log,
  genaratorOtpToken,
  genaratorToken,
  getEnv,
} from "../core/utils.mjs";
import multer from "multer";
import { UserModel } from "../globalMoudles.mjs";
import crypto from "../core/crypto.mjs";
import redis from "../core/redis.mjs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import util from "util";
import { PassThrough } from "stream";
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
      const __filename = fileURLToPath(import.meta.url);
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
      log(resultUpload);
      if (resultUpload.modifiedCount || resultUpload.modifiedCount === 1) {
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
}

export default ProfileController;
