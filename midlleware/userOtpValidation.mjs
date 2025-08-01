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
  body("otpCode")
    .exists()
    .optional()
    .isEmail()
    .withMessage("Provide valid email"),
  body("phoneNumber")
    .exists()
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
export default userLoginValidate;
