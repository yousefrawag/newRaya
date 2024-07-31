const { body } = require("express-validator");
const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");
const roleSchema = require("../../model/roleSchema");
exports.insert = [
  body("fullName")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("user full name should be String")
    .isLength({ min: 4 })
    .withMessage("user name length should be more that 4 "),
  body("password")
    .isString()
    .withMessage("password should be String")
    .isLength({ min: 4 })
    .withMessage("password length should be more that 4 "),
  body("email")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (value) => {
      try {
        const existingUser = await userSchema.findOne({ email: value });
        const existingCustomer = await customerSchema.findOne({ email: value });
        if (existingUser || existingCustomer) {
          return Promise.reject("This email is already in use");
        }
      } catch (err) {
        return Promise.reject("An error occurred while checking the email");
      }
    }),
  body("type")
    .isIn(["admin", "employee"])
    .withMessage("user type should be an admin or employee"),
  body("role")
    .optional()
    .isInt()
    .withMessage("you must provide a a valid role id")
    .custom((value) => {
      return roleSchema
        .findOne({ _id: value })
        .then((role) => {
          if (!role) throw new Error("Role doesn't exist");
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),
];
exports.update = [
  body("id").isInt().withMessage("child ID is a number"),
  body("fullName")
    .optional()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("user full name should be String")
    .isLength({ min: 4 })
    .withMessage("user name length should be more that 4 "),
  body("password")
    .optional()
    .isString()
    .withMessage("password should be String")
    .isLength({ min: 4 })
    .withMessage("password length should be more that 4 "),
  body("email")
    .optional()
    .isEmail()
    .withMessage("invalid email")
    .custom(async (value) => {
      try {
        const existingUser = await userSchema.findOne({ email: value });
        const existingCustomer = await customerSchema.findOne({ email: value });
        if (existingUser || existingCustomer) {
          return Promise.reject("This email is already in use");
        }
      } catch (err) {
        return Promise.reject("An error occurred while checking the email");
      }
    }),
  body("type")
    .optional()
    .isIn(["admin", "employee"])
    .withMessage("user type should be an admin or employee"),
];
