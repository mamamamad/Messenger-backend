/**
 * user.mjs
 * --------
 * User-related routes for authentication.
 * Includes login endpoints with validation.
 */

import { Router } from "express";
import userLoginValidate from "../midlleware/userLoginValidate.mjs";
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

/**
 * POST /login
 * Handles user login with validation.
 */
route.post("/login", userLoginValidate, (req, res) =>
  Usercontroller.userLogin(req, res)
);

export default route;
