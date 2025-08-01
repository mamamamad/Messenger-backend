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
const userRestPassword = [
  body("pass1")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters"),
  body("pass2")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters"),
  body("PhoneNumber")
    .exists()
    .withMessage("Numberphone is required")
    .isNumeric()
    .optional()
    .custom((value) => {
      let phone = value.toString();
      if (!phone.startsWith("09")) {
        throw new Error("Phone number must start with 09");
      }
      if (phone.length !== 11) {
        throw new Error("Phone number must be exactly 11 digits");
      }
      return true;
    }),
];
export default userRestPassword;
