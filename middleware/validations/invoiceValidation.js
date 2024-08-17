const { body } = require("express-validator");
const customerSchema = require("../../model/customerSchema");
const projectSchema = require("../../model/projectSchema");

exports.insert = [
  body("client")
    .isInt()
    .withMessage("Client ID must be an integer")
    .notEmpty()
    .withMessage("Client ID is required")
    .custom((value) => {
      return customerSchema
        .findOne({ _id: value })
        .then((client) => {
          if (!client) throw new Error("Client doesn't exist");
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),
  body("project")
    .isInt()
    .withMessage("Project ID must be an integer")
    .notEmpty()
    .withMessage("Project ID is required")
    .custom((value) => {
      return projectSchema
        .findOne({ _id: value })
        .then((project) => {
          if (!project) throw new Error("Porject doesn't exist");
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),

  body("estateType")
    .isString()
    .withMessage("Estate type must be a string")
    .notEmpty()
    .withMessage("Estate type is required"),

  body("dueDate")
    .isISO8601()
    .withMessage("Due date must be a valid date in ISO 8601 format")
    .notEmpty()
    .withMessage("dueDate type is required"),

  body("status")
    .isIn(["pending", "paid", "overdue", "canceled"])
    .withMessage(
      "Status must be one of 'pending', 'paid', 'overdue', or 'canceled'"
    ),

  body("total")
    .isString()
    .withMessage("Total must be a string")
    .notEmpty()
    .withMessage("Total is required")
    .matches(/^\d+(\.\d{1,2})?$/)
    .withMessage(
      "Total must be a valid number format (e.g., '1000', '1000.00')"
    ),

  body("notes").isString().withMessage("Notes must be a string").optional(),
];

exports.update = [
  body("client")
    .optional()
    .isInt()
    .withMessage("Client ID must be an integer")
    .notEmpty()
    .withMessage("Client ID is required")
    .custom((value) => {
      return customerSchema
        .findOne({ _id: value })
        .then((client) => {
          if (!client) throw new Error("Client doesn't exist");
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),
  body("project")
    .optional()
    .isInt()
    .withMessage("Project ID must be an integer")
    .notEmpty()
    .withMessage("Project ID is required")
    .custom((value) => {
      return projectSchema
        .findOne({ _id: value })
        .then((project) => {
          if (!project) throw new Error("Porject doesn't exist");
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),

  body("estateType")
    .optional()
    .isString()
    .withMessage("Estate type must be a string")
    .notEmpty()
    .withMessage("Estate type is required"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date in ISO 8601 format")
    .notEmpty()
    .withMessage("dueDate type is required"),

  body("status")
    .optional()
    .isIn(["pending", "paid", "overdue", "canceled"])
    .withMessage(
      "Status must be one of 'pending', 'paid', 'overdue', or 'canceled'"
    ),

  body("total")
    .optional()
    .isString()
    .withMessage("Total must be a string")
    .notEmpty()
    .withMessage("Total is required")
    .matches(/^\d+(\.\d{1,2})?$/)
    .withMessage(
      "Total must be a valid number format (e.g., '1000', '1000.00')"
    ),

  body("notes").isString().withMessage("Notes must be a string").optional(),
];
