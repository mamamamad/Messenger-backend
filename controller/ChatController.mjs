/**
 * UserController
 * --------------
 * Handles user authentication and login logic.
 */

import { validationResult } from "express-validator";
import BaseController from "../core/Basecontroller.mjs";
import { log, getEnv } from "../core/utils.mjs";
import multer from "multer";
import { messageModel, UserModel } from "../globalMoudles.mjs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import util from "util";
import crypto from "../core/crypto.mjs";
import redis from "../core/redis.mjs";
/**
 * Controller for  User Profile.
 */
class ChatController extends BaseController {
  #storage;
  #upload;
  __dirname;
  constructor() {
    try {
      super();
      this.messageModel = messageModel;
      this.userModel = UserModel;
      log(getEnv("BASE_PATH"));
      this.__dirname = getEnv("BASE_PATH");
      this.#storage = multer.diskStorage({
        destination: path.join(this.__dirname, "/media/Files/"),
        filename: function (req, file, cb) {
          const rand = crypto.randomNum();
          cb(null, Date.now() + rand + path.extname(file.originalname));
        },
      });
      this.#upload = multer({
        storage: this.#storage,
        limits: { fileSize: 20000000 }, // 20MB file size limit
        fileFilter: this.fileFilter,
      }).single("File");
      this.uploadMiddleware = util.promisify(this.#upload);
    } catch (e) {
      log(e);
    }
  }
  fileFilter(req, file, cb) {
    try {
      const allowedExtensions = /jpeg|jpg|png|mp4/;

      const extname = allowedExtensions.test(
        path.extname(file.originalname).toLowerCase()
      );

      const mimetype = allowedExtensions.test(file.mimetype);

      if (mimetype && extname) {
        cb(null, true);
      } else {
        cb(new Error("Only images are allowed (jpeg, jpg, png ,mp4)"));
      }
    } catch (e) {
      log(e);
    }
  }
  async uploadfile(req, res) {
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
      let pathAvatar = "/media/Files/" + req.file.filename;

      return res.json({ code: 1, msg: pathAvatar });
    } catch (e) {
      log(e);
    }
  }
  async publicChat(req, res) {
    try {
      const data = await this.messageModel.fetchMessages("", "All");

      var messages = await Promise.all(
        data.map(async (element) => {
          const user = await this.userModel.userExistEmail(element.from);
          return {
            id: element.id,
            from: user[0].Fname + " " + user[0].Lname,
            to: element.to,
            message: element.message,
            pin: element.pin,
            date: element.date,
            username: user[0].username,
            avatar: user[0].avatar,
            is_Image: element.is_Image,
          };
        })
      );

      return res.json({ Messages: messages });
    } catch (e) {
      log(e);
    }
  }
  async deleteMessage(req, res) {
    try {
      const id = req.params.id;
      let userData = await this.messageModel.messageExistid(id);
      if (!userData) {
        return res
          .status(400)
          .json({ code: 0, msg: "the message is not Found." });
      }

      if (userData[0].from === req.userEmail) {
        const data = await this.messageModel.deleteMessage(id);
        if (data) {
          return res.json({ code: 1, msg: "the message is deleted." });
        } else {
          return res
            .status(400)
            .json({ code: 0, msg: "the message is not deleted." });
        }
      }
      return res
        .status(400)
        .json({ code: 0, msg: "you cannot delete this message." });
    } catch (e) {
      log(e);
    }
  }
  async editMessage(req, res) {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(403).json({
          code: 0,
          msg: "edit fail",
          error: err.errors.map((e) => e.msg),
        });
      }
      const { id, newMessage } = req.body;
      let userData = await this.messageModel.messageExistid(id);
      if (!userData) {
        return res
          .status(400)
          .json({ code: 0, msg: "the message is not Found." });
      }
      if (userData[0].from === req.userEmail) {
        const result = await this.messageModel.updateMessage(id, newMessage);
        if (result.modifiedCount || result.modifiedCount === 1) {
          return res.json({ code: 1, msg: "the message is Edited." });
        } else {
          return res
            .status(400)
            .json({ code: 0, msg: "the message is not Edited." });
        }
      }
      return res
        .status(400)
        .json({ code: 0, msg: "you cannot Edit this message." });
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

export default ChatController;
