/**
 * userLoginValidate.mjs
 * ---------------------
 * Express-validator middleware for validating user login requests.
 * Checks for valid email and password fields.
 */

import { body } from "express-validator";

/**
 * Validation rules for user login.
 * - email: optional, must be a valid email if provided
 * - password: required, must be a string with at least 5 characters
 */
const userLoginValidate = [
  body("email").optional().isEmail().withMessage("Provide valid email"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters"),
];
export default userLoginValidate;
