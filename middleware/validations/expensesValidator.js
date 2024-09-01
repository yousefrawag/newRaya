const { body } = require("express-validator");

exports.insert = [
  body("expenseName")
    .isString()
    .withMessage("user full name should be String")
    .notEmpty()
    .withMessage("Expenses name is required"),

  body("projectName")
    .isString()
    .withMessage("Project name must be a string")
    .notEmpty()
    .withMessage("Project name is required"),

  body("expenseTotal")
    .isString()
    .withMessage("Expenses total must be a string")
    .notEmpty()
    .withMessage("Expenses total is required")
    .matches(/^\d+$/)
    .withMessage("Expenses total must contain only digits"),

  body("details").isString().withMessage("Details must be a string").optional(),
];

exports.update = [
  body("expenseName")
    .optional()
    .isString()
    .withMessage("user full name should be String")
    .notEmpty()
    .withMessage("Expenses name is required"),

  body("projectName")
    .optional()
    .isString()
    .withMessage("Project name must be a string")
    .notEmpty()
    .withMessage("Project name is required"),



  body("expenseTotal")
    .optional()
    .isString()
    .withMessage("Expenses total must be a string")
    .notEmpty()
    .withMessage("Expenses total is required")
    .matches(/^\d+$/)
    .withMessage("Expenses total must contain only digits"),

  body("details").optional().isString().withMessage("Details must be a string"),
];
