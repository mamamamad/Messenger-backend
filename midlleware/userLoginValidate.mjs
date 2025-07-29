import { body } from "express-validator";

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
