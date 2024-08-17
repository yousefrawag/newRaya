const { body } = require("express-validator");
const chatSchema = require("../../model/chatSchema");
const userSchema = require("../../model/userSchema");

exports.send = [
  body("chatID")
    .isInt()
    .withMessage("Chat Id must be a number")
    .custom((value) => {
      return chatSchema.findOne({ _id: value }).then((chat) => {
        if (!chat) throw new Error("Chat doesn't exist");
      });
    }),
  body("senderID")
    .isInt()
    .withMessage("Sender Id must be a number")
    .custom((value) => {
      return userSchema.findOne({ _id: value }).then((user) => {
        if (!user) throw new Error("User doesn't exist");
      });
    }),
  body("content").isString().withMessage("Message Content is a String"),
];
