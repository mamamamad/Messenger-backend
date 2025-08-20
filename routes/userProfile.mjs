import UserController from "../controller/Usercontroller.mjs";
import { Router } from "express";
import { authJwt } from "../middleware/authMiddleware.mjs";
const userCon = new UserController();

const route = Router();

route.get("/", authJwt, userCon.profile);

export default route;
