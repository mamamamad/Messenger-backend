/**
 * user.mjs
 * --------
 * User-related routes for authentication.
 * Includes login endpoints with validation.
 */
import { infoAdmin } from "./../middleware/adminInfo.mjs";
import { Router } from "express";
import { matchedData } from "express-validator";
import { editMessage, userLogin } from "../middleware/userValidate.mjs";
import validateBody from "../middleware/validateBodyReq.mjs";
import AdminController from "../controller/AdminController.mjs";
import { authJwtAdmin } from "../middleware/authMiddleware.mjs";
import { log } from "../core/utils.mjs";
const adminCon = new AdminController();
/**
 * Router for user authentication endpoint.
 */

const route = Router();
route.get("/test", (req, res) => {
  return res.json({ msg: "hi pan" });
});

route.get("/", (req, res) => {
  try {
    return res.render("pages/login");
  } catch (e) {
    log(e);
  }
});
route.get("/dashboard", authJwtAdmin, infoAdmin, adminCon.dashboard);

route.get("/dashboard/admin", authJwtAdmin, infoAdmin, adminCon.AdminPage);
route.post(
  "/dashboard/addadmin",
  authJwtAdmin,
  new validateBody(["email", "password1", "password2", "nickname", "level"])
    .handle,
  adminCon.addAdmin
);

route.get("/dashboard/manageUsers", authJwtAdmin, infoAdmin, (req, res) => {
  return res.render("pages/dashboard/manageUsers.njk", {
    users: [{ Id: 1, email: "mamad", nickName: "amama" }],
  });
});

route.get("/dashboard/messages", authJwtAdmin, infoAdmin, (req, res) => {
  return res.render("pages/dashboard/Messages.njk", { messages: [] });
});
route.get("/dashboard/logout", authJwtAdmin, adminCon.logOut);

route.post(
  "/login",
  userLogin,
  new validateBody(["email", "password"]).handle,
  adminCon.adminLogin
);

export default route;
