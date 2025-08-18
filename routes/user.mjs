/**
 * user.mjs
 * --------
 * User-related routes for authentication.
 * Includes login endpoints with validation.
 */

import { Router } from "express";
import { matchedData } from "express-validator";
import {
  userLoginValidate,
  userRestPassword,
  userOtpValidate,
  userRegester,
  emailValidate,
  userLogin,
} from "../midlleware/userValidate.mjs";
import validateBody from "../midlleware/validateBodyReq.mjs";
import { Usercontroller } from "./../controller/UserController.mjs";

/**
 * Router for user authentication endpoints.
 */
const UserController = new Usercontroller();
const route = Router();

/**
 * GET /login
 * Test endpoint for login route.
 */
//

/** validate body is a function for keys in json for prevent Mass Assignment */

/**
 * POST /login
 * Handles user login with validation.
 */

route.post(
  "/login",
  userLogin,
  new validateBody(["email", "password"]).handle,
  (req, res) => UserController.userLogin(req, res)
);
route.post(
  "/register",
  userRegester,
  new validateBody(["Fname", "Lname", "username", "email", "pass1", "pass2"])
    .handle,
  UserController.register
);
// route.post(
//   "/send-otp",
//   emailValidate,
//   validateBody(["email"]),
//   UserController.sendOtp
// );
// route.post(
//   "/verify-otp",
//   validateBody(["email", "otpCode"]),
//   userOtpValidate,
//   UserController.verifyOtp
// );
// route.post(
//   "/forgetPassword",
//   userRestPassword,
//   validateBody(["email", "pass1", "pass2"]),
//   UserController.forgetPassword
// );

export default route;
