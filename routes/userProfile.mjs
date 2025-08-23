import ProfileController from "../controller/ProfileController.mjs";
import { Router } from "express";
import { matchedData } from "express-validator";
import { authJwt } from "../middleware/authMiddleware.mjs";
import validateBody from "../middleware/validateBodyReq.mjs";
import {
  userUpdatePersonal,
  userChangeEmail,
} from "../middleware/userValidate.mjs";
const profCon = new ProfileController();

const route = Router();

route.get("/", authJwt, profCon.profile);
route.put("/uploadProfilePicture", authJwt, profCon.uploadProfilePicture);
route.delete("/deleteProfilePicture", authJwt, profCon.deleteProfilePicture);
route.put(
  "/updateProfile",
  userUpdatePersonal,
  authJwt,

  new validateBody(["Fname", "Lname", "username"]).handle,
  profCon.updatePersonalData
);
route.put(
  "/changeEmail",
  authJwt,
  userChangeEmail,
  new validateBody(["newEmail", "password"]).handle,
  profCon.changEmail
);
// route.post(
//   "/test",
//   profCon.clearToken
// );

export default route;
