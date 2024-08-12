const { body } = require("express-validator");
const userSchema = require("../../model/userSchema");
const projectSchema = require("../../model/projectSchema");

exports.insert = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title is required"),

  body("missionType")
    .isString()
    .withMessage("Mission type must be a string")
    .notEmpty()
    .withMessage("Mission type is required"),

  body("description")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 4 })
    .withMessage("Description length must be more that 4 character"),
  body("deadline")
    .isISO8601()
    .withMessage("mission deadline must be a valid ISO 8601 date")
    .notEmpty()
    .withMessage("deadline type is required"),
  body("status")
    .isString()
    .withMessage("Status must be a string")
    .isIn(["inprogress", "not completed", "completed"])
    .withMessage(
      'Status must be one of "inprogress", "not completed", or "completed"'
    ),

  body("assignedTo")
    .isInt()
    .withMessage("AssignedTo must be an integer")
    .custom((value) => {
      return userSchema
        .findOne({ _id: value })
        .then((object) => {
          if (!object) throw new Error("this employee doesn't exist");
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),
  body("project")
    .isInt()
    .withMessage("Project must be an integer")
    .custom((value) => {
      return projectSchema
        .findOne({ _id: value })
        .then((object) => {
          if (!object) throw new Error("this project doesn't exist");
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),

];

exports.update = [
  body("id").isInt(),
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title is required"),

  body("missionType")
    .optional()
    .isString()
    .withMessage("Mission type must be a string")
    .notEmpty()
    .withMessage("Mission type is required"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 4 })
    .withMessage("Description length must be more that 4 character"),
  body("deadline")
    .isISO8601()
    .withMessage("Meeting date must be a valid ISO 8601 date")
    .notEmpty()
    .withMessage("deadline type is required"),
  body("status")
    .optional()
    .isString()
    .withMessage("Status must be a string")
    .isIn(["inprogress", "not completed", "completed"])
    .withMessage(
      'Status must be one of "inprogress", "not completed", or "completed"'
    ),

  body("assignedTo")
    .optional()
    .isInt()
    .withMessage("AssignedTo must be an integer")
    .custom((value) => {
      return userSchema
        .findOne({ _id: value })
        .then((object) => {
          if (!object) throw new Error("this employee doesn't exist");
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),
  body("project")
    .optional()
    .isInt()
    .withMessage("Project must be an integer")
    .custom((value) => {
      return projectSchema
        .findOne({ _id: value })
        .then((object) => {
          if (!object) throw new Error("this project doesn't exist");
        })
        .catch((err) => {
          throw new Error(err);
        });
    }),
];
