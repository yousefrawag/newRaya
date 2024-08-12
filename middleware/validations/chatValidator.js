const { body } = require("express-validator");
const userSchema = require("../../model/userSchema");
const missionSchema = require("../../model/missionSchema");
exports.create = [
  body("employeeID")
    .isInt()
    .withMessage("Employee ID is a number")
    .custom((value) => {
      return userSchema.findOne({ _id: value }).then((user) => {
        if (!user) throw new Error("employee doesn't exist");
      });
    }),
  body("missionID")
    .isInt()
    .withMessage("Mission ID is a number")
    .custom((value) => {
      return missionSchema.findOne({ _id: value }).then((mission) => {
        if (!mission) throw new Error("mission doesn't exist");
      });
    }),
];
