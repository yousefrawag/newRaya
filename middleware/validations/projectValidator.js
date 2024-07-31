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

  body("specificEstate")
    .isString()
    .withMessage("Specific estate should be a string")
    .notEmpty()
    .withMessage("Specific estate  is required"),

  body("clientType")
    .isString()
    .withMessage("Client type should be a string")
    .notEmpty()
    .withMessage("Estate number  is required"),

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
    .isString()
    .withMessage("Installments should be a string")
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
    .isString()
    .withMessage("Finishing quality should be a string")
    .notEmpty()
    .withMessage("Finishing quality is required"),

  body("addedBy")
    .isInt()
    .withMessage("AddedBy should be a number")
    .custom((value) => {
      return userSchema
        .findOne({ _id: value })
        .then((object) => {
          if (!object) {
            throw new Error("this user doesn't exist");
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),
];

exports.update = [
  body("id").isInt(),
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
    .withMessage("Governorate is required"),

  body("city")
    .optional()
    .isString()
    .withMessage("City should be a string")
    .notEmpty()
    .withMessage("City is required"),

  body("estateNumber")
    .optional()
    .isString()
    .withMessage("Estate number should be a string")
    .notEmpty()
    .withMessage("Estate number is required"),

  body("specificEstate")
    .optional()
    .isString()
    .withMessage("Specific estate should be a string")
    .notEmpty()
    .withMessage("Specific estate is required"),

  body("clientType")
    .optional()
    .isString()
    .withMessage("Client type should be a string")
    .notEmpty()
    .withMessage("Client type is required"),

  body("estatePrice")
    .optional()
    .isNumeric()
    .withMessage("Estate price should be a number")
    .notEmpty()
    .withMessage("Estate price is required"),

  body("operationType")
    .optional()
    .isString()
    .withMessage("Operation type should be a string")
    .notEmpty()
    .withMessage("Operation type is required"),

  body("installments")
    .optional()
    .isString()
    .withMessage("Installments should be a string")
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
    .withMessage("Area matter is required"),

  body("finishingQuality")
    .optional()
    .isString()
    .withMessage("Finishing quality should be a string")
    .notEmpty()
    .withMessage("Finishing quality is required"),

  body("addedBy")
    .optional()
    .isInt()
    .withMessage("AddedBy should be a number")
    .custom((value) => {
      return userSchema
        .findOne({ _id: value })
        .then((object) => {
          if (!object) {
            throw new Error("this user doesn't exist");
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),
];
