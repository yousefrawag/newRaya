const { body } = require("express-validator");
const userSchema = require("../../model/userSchema");

exports.insert = [
  body("estateType")
    .isString()
    .withMessage("Estate type should be a string")
    .notEmpty()
    .withMessage("Estate type is required"),

  body("governorate")
    .isString()
    .withMessage("Governorate should be a string")
    .notEmpty()
    .withMessage("Governorate  is required"),

  body("city")
    .isString()
    .withMessage("City should be a string")
    .notEmpty()
    .withMessage("City  is required"),

  body("estateNumber")
    .isString()
    .withMessage("Estate number should be a string")
    .notEmpty()
    .withMessage("Estate number  is required"),

  body("floor")
    .isIn(["upstairs", "ground floor"])
    .withMessage("floor should be  upstairs or ground floor"),
  body("detailedAddress")
    .isString()
    .withMessage("detailedAddress should be a string")
    .notEmpty()
    .withMessage("detailedAddress  is required"),
  body("clientType")
    .isString()
    .withMessage("Client type should be a string")
    .notEmpty()
    .withMessage("Client type  is required"),

  body("estatePrice")
    .isNumeric()
    .withMessage("Estate price should be a number")
    .notEmpty()
    .withMessage("Estate price  is required"),

  body("operationType")
    .isString()
    .withMessage("Operation type should be a string")
    .notEmpty()
    .withMessage("Operation is required"),

  body("installments")
    .isBoolean()
    .withMessage("Installments should be a boolean")
    .notEmpty()
    .withMessage("Installments is required"),

  body("installmentsPerYear")
    .isNumeric()
    .withMessage("Installments per year should be a number")
    .notEmpty()
    .withMessage("Installments per year is required"),

  body("areaMatter")
    .isString()
    .withMessage("Area matter should be a string")
    .notEmpty()
    .withMessage("Area matter  is required"),

  body("finishingQuality")
    .isIn(["high", "medium", "normal"])
    .withMessage("finishingQuality  should be an high, medium or normal"),
];

exports.update = [
  body("estateType")
    .optional()
    .isString()
    .withMessage("Estate type should be a string")
    .notEmpty()
    .withMessage("Estate type is required"),

  body("governorate")
    .optional()
    .isString()
    .withMessage("Governorate should be a string")
    .notEmpty()
    .withMessage("Governorate  is required"),

  body("city")
    .optional()
    .isString()
    .withMessage("City should be a string")
    .notEmpty()
    .withMessage("City  is required"),

  body("estateNumber")
    .optional()
    .isString()
    .withMessage("Estate number should be a string")
    .notEmpty()
    .withMessage("Estate number  is required"),

  body("floor")
    .optional()
    .isIn(["upstairs", "ground floor"])
    .withMessage("user type should be an upstairs, ground floor"),
  body("detailedAddress")
    .optional()
    .isString()
    .withMessage("detailedAddress should be a string")
    .notEmpty()
    .withMessage("detailedAddress  is required"),
  body("clientType")
    .optional()
    .isString()
    .withMessage("Client type should be a string")
    .notEmpty()
    .withMessage("Client type  is required"),

  body("estatePrice")
    .optional()
    .isNumeric()
    .withMessage("Estate price should be a number")
    .notEmpty()
    .withMessage("Estate price  is required"),

  body("operationType")
    .optional()
    .isString()
    .withMessage("Operation type should be a string")
    .notEmpty()
    .withMessage("Operation is required"),

  body("installments")
    .optional()
    .isBoolean()
    .withMessage("Installments should be a boolean")
    .notEmpty()
    .withMessage("Installments is required"),

  body("installmentsPerYear")
    .optional()
    .isNumeric()
    .withMessage("Installments per year should be a number")
    .notEmpty()
    .withMessage("Installments per year is required"),

  body("areaMatter")
    .optional()
    .isString()
    .withMessage("Area matter should be a string")
    .notEmpty()
    .withMessage("Area matter  is required"),

  body("finishingQuality")
    .optional()
    .isIn(["high", "medium", "normal"])
    .withMessage("finishingQuality  should be an high, medium or normal"),
];
