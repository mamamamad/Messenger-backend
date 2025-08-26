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
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];

export const editMessage = [
  body("newMessage")
    .exists()
    .withMessage("newMessage is required")
    .notEmpty()
    .withMessage("the newMessage cannot be empty."),
  body("id")
    .exists()
    .withMessage("id is required")
    .notEmpty()
    .withMessage("the id cannot be empty."),
];

/**
 * Validation rules for user login.
 * - phone number: phone number should be 11 nunumber. and start with 09
 *
 */
export const emailValidate = [
  body("email")
    .exists()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .optional()
    .isEmail()
    .withMessage("Provide valid email"),
];
export const userRestPassword = [
  body("pass1")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .notEmpty()
    .withMessage("pass1 cannot be empty")
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
    .notEmpty()
    .withMessage("pass2 cannot be empty")
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
    .notEmpty()
    .withMessage("Email cannot be empty")
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
    .notEmpty()
    .withMessage("pass1 cannot be empty")
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
    .notEmpty()
    .withMessage("pass2 cannot be empty")
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
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Provide valid email")
    .normalizeEmail(),
  body("Fname")
    .exists()
    .withMessage("the fname not exsits")
    .notEmpty()
    .withMessage("Fname cannot be empty")
    .isLength({ min: 4 })
    .withMessage("the fname min lengh must be 4 char")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores."
    ),
  body("Lname")
    .exists()
    .withMessage("the Lname not exsits")
    .notEmpty()
    .withMessage("Lname cannot be empty")

    .isLength({ min: 4 })
    .withMessage("the Lname min lengh must be 4 char")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores."
    ),
  body("username")
    .exists()
    .withMessage("the username not exsits")
    .notEmpty()
    .withMessage("username cannot be empty")

    .isLength({ min: 3 })
    .withMessage("the username min lengh must be 3 char")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores."
    ),
];
export const userLogin = [
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .exists()
    .isEmail()
    .withMessage("Provide valid email"),
];
export const userChangeEmail = [
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("newEmail")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .exists()

    .isEmail()
    .withMessage("Provide valid email"),
];
export const refreshToken = [
  body("RefreshToken")
    .exists()
    .withMessage("token is required")
    .notEmpty()
    .withMessage(" RefreshToken cannot be empty")
    .isLength({ max: 80, min: 80 })
    .withMessage("the token is not Valid"),
];
export const userUpdatePersonal = [
  body("Fname")
    .optional({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("the fname min lengh must be 4 char")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores."
    ),
  body("Lname")
    .optional({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("the Lname min lengh must be 4 char")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores."
    ),
  body("username")
    .optional({ checkFalsy: true })
    .isLength({ min: 3 })
    .withMessage("the username min lengh must be 3 char")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores."
    ),
];
