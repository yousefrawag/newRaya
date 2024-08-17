const { body } = require("express-validator");
const userSchema = require("../../model/userSchema");

exports.insert = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title is required"),

  body("meetingDate")
    .isISO8601()
    .withMessage("Meeting date must be a valid ISO 8601 date")
    .notEmpty()
    .withMessage("deadline type is required"),

  body("meetingDetails")
    .isString()
    .withMessage("Meeting details must be a string")
    .optional(),

  body("meetingResult")
    .isString()
    .withMessage("Meeting result must be a string")
    .optional(),
];

exports.update = [
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title is required"),

  body("meetingDate")
    .optional()
    .isISO8601()
    .withMessage("Meeting date must be a valid date")
    .notEmpty()
    .withMessage("deadline type is required"),

  body("meetingDetails")
    .optional()
    .isString()
    .withMessage("Meeting details must be a string"),

  body("meetingResult")
    .optional()
    .isString()
    .withMessage("Meeting result must be a string"),
  body("addedBy")
    .optional()
    .isInt()
    .withMessage("AddedBy must be an integer")
    .custom((value) => {
      return userSchema
        .findOne({ _id: value })
        .then((user) => {
          if (!user) {
            throw new Error("this user doesn't exist");
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),
];
