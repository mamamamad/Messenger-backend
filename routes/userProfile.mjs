import ProfileController from "../controller/ProfileController.mjs";
import { Router } from "express";
import { authJwt } from "../middleware/authMiddleware.mjs";
const profCon = new ProfileController();

const route = Router();

route.get("/", authJwt, profCon.profile);
route.put("/uploadProfilePicture", authJwt, profCon.uploadProfilePicture);
route.delete("/deleteProfilePicture", authJwt, profCon.deleteProfilePicture);

export default route;
