const { body } = require("express-validator");
const userSchema = require("../../model/userSchema");
const customerSchema = require("../../model/customerSchema");
exports.insert = [
  body("fullName")
    .isString()
    .withMessage("user full name should be String")
    .isLength({ min: 3 })
    .withMessage("user name length should be more that 3 "),
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
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
  body("governorate")
    .notEmpty()
    .withMessage("Governorate is required")
    .isString()
    .withMessage("Governorate should be a string"),
  body("phoneNumber").isArray().withMessage("Phone number should be an array"),
  body("phoneNumber.*")
    .isString()
    .withMessage("Each phone number should be a string")
    .matches(/^\d{11}$/)
    .withMessage("Each phone number should be exactly 11 digits long"),
  body("cardNumber").isString().withMessage("Card number should be a string"),
  body("type")
    .isIn(["client", "mediator"])
    .withMessage('Type should be either "client" or "mediator"'),
];
exports.update = [
  body("fullName")
    .optional()
    .isString()
    .withMessage("user full name should be String")
    .isLength({ min: 3 })
    .withMessage("user name length should be more that 3 "),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
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
  body("governorate")
    .optional()
    .notEmpty()
    .withMessage("Governorate is required")
    .isString()
    .withMessage("Governorate should be a string"),
  body("phoneNumber")
    .optional()
    .isArray()
    .withMessage("Phone number should be an array"),
  body("phoneNumber.*")
    .optional()
    .isString()
    .withMessage("Each phone number should be a string")
    .matches(/^\d{11}$/)
    .withMessage("Each phone number should be exactly 11 digits long"),
  body("detailedAddress")
    .notEmpty()
    .withMessage("detailedAddress is required")
    .optional()
    .isString()
    .withMessage("detailedAddress should be a string"),
  body("cardNumber")
    .optional()
    .isString()
    .withMessage("Card number should be a string"),
  body("type")
    .optional()
    .isIn(["client", "mediator"])
    .withMessage('Type should be either "client" or "mediator"'),
];
