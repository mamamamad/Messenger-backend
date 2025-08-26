/**
 * user.mjs
 * --------
 * User-related routes for authentication.
 * Includes login endpoints with validation.
 */

import { Router } from "express";
import { matchedData } from "express-validator";
import { editMessage } from "../middleware/userValidate.mjs";
import validateBody from "../middleware/validateBodyReq.mjs";
import ChatController from "../controller/ChatController.mjs";
import { authJwt } from "../middleware/authMiddleware.mjs";

const chatCon = new ChatController();
/**
 * Router for user authentication endpoint.
 */

const route = Router();

route.get("/PublicChat", authJwt, chatCon.publicChat);
route.get("/DeleteMessage:id", authJwt, chatCon.deleteMessage);
route.post(
  "/EditMessage",

  // new validateBody(["id", "newMessage"]).handle,
  authJwt,
  editMessage,
  chatCon.editMessage
);

export default route;
