const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const messageSchema = mongoose.Schema(
  {
    _id: Number,
    chatID: {
      type: Number,
      ref: "chats",
    },
    senderID: {
      type: Number,
      ref: "users",
    },
    content: { type: String },
  },
  {
    timestamps: true,
  }
);
messageSchema.plugin(autoIncrement, { id: "messageID" });
module.exports = mongoose.model("messages", messageSchema);
