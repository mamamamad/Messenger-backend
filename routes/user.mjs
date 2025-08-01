/**
 * user.mjs
 * --------
 * User-related routes for authentication.
 * Includes login endpoints with validation.
 */

import { Router } from "express";
import { matchedData } from "express-validator";
import userLoginValidate from "../midlleware/userLoginValidate.mjs";
import userPhoneValidate from "../midlleware/userPhoneValidate.mjs";
import userRestPassword from "../midlleware/userResetPassword.mjs";
import Usercontroller from "../controller/Usercontroller.mjs";

/**
 * Router for user authentication endpoints.
 */
const route = Router();

/**
 * GET /login
 * Test endpoint for login route.
 */
route.get("/login", userLoginValidate, (req, res) => {
  // log(req.body);
  return res.send("dada");
});

/** validate body is a function for keys in json for prevent Mass Assignment */
function validateBody(allowedFields) {
  return (req, res, next) => {
    try {
      Object.keys(req.body).forEach((element) => {
        if (!allowedFields.includes(element)) {
          delete req.body[element];
        }
      });
      next();
    } catch (e) {
      console.log(e);
    }
  };
}
/**
 * POST /login
 * Handles user login with validation.
 */
route.post(
  "/login",
  validateBody(["email", "password"]),
  userLoginValidate,
  (req, res) => Usercontroller.userLogin(req, res)
);
route.post(
  "/send-otp",
  userPhoneValidate,
  validateBody(["phoneNumber"]),
  Usercontroller.sendOtp
);
route.post(
  "/verify-otp",
  validateBody(["phoneNumber", "otpCode"]),
  Usercontroller.verifyOtp
);
route.post(
  "/forgetPassword",
  userRestPassword,
  validateBody(["phoneNumber", "pass1", "pass2"]),
  Usercontroller.forgetPassword
);
export default route;
