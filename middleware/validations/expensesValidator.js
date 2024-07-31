const { body } = require("express-validator");

exports.insert = [
  body("expenseName")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("user full name should be String")
    .notEmpty()
    .withMessage("Expenses name is required"),

  body("projectName")
    .isString()
    .withMessage("Project name must be a string")
    .notEmpty()
    .withMessage("Project name is required"),

  body("EstateType")
    .isString()
    .withMessage("Estate type must be a string")
    .notEmpty()
    .withMessage("Estate type is required"),

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
  body("id").isInt().withMessage("ID must be an integer"),

  body("expenseName")
    .optional()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("user full name should be String")
    .notEmpty()
    .withMessage("Expenses name is required"),

  body("projectName")
    .optional()
    .isString()
    .withMessage("Project name must be a string")
    .notEmpty()
    .withMessage("Project name is required"),

  body("EstateType")
    .optional()
    .isString()
    .withMessage("Estate type must be a string")
    .notEmpty()
    .withMessage("Estate type is required"),

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
