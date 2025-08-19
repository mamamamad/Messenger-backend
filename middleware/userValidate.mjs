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
export const userLoginValidate = [
  body("email")
    .exists()
    .optional()
    .isEmail()
    .withMessage("Provide valid email"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters"),
];

/**
 * Validation rules for user login.
 * - phone number: phone number should be 11 nunumber. and start with 09
 *
 */
export const emailValidate = [
  body("email")
    .exists()
    .optional()
    .isEmail()
    .withMessage("Provide valid email"),
];
export const userRestPassword = [
  body("pass1")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character."),
  body("pass2")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character."),
  body("email")
    .exists()
    .optional()
    .isEmail()
    .withMessage("Provide valid email"),
];
export const userOtpValidate = [
  body("otpCode")
    .exists()
    .optional()
    .isEmail()
    .withMessage("Provide valid email"),
  body("email")
    .exists()
    .optional()
    .isEmail()
    .withMessage("Provide valid email"),
];

export const userRegester = [
  body("pass1")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character."),
  body("pass2")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character."),
  body("email")
    .exists()
    .optional()
    .isEmail()
    .withMessage("Provide valid email")
    .normalizeEmail(),
  body("Fname")
    .exists()
    .withMessage("the fname not exsits")
    .isLength({ min: 4 })
    .withMessage("the fname min lengh must be 4 char")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores."
    ),
  body("Lname")
    .exists()
    .withMessage("the Lname not exsits")
    .isLength({ min: 4 })
    .withMessage("the Lname min lengh must be 4 char")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores."
    ),
  body("username")
    .exists()
    .withMessage("the username not exsits")
    .isLength({ min: 3 })
    .withMessage("the username min lengh must be 3 char")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores."
    ),
];
export const userLogin = [
  body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters"),
  body("email")
    .exists()
    .optional()
    .isEmail()
    .withMessage("Provide valid email"),
];
