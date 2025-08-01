import { body } from "express-validator";

/**
 * Validation rules for user login.
 * - phone number: phone number should be 11 nunumber. and start with 09
 *
 */
const userPhoneValidate = [
  body("PhoneNumber")
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
export default userPhoneValidate;
