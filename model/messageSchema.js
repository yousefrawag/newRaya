const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const file = mongoose.Schema(
  {
    fileURL: String,
    fileID: String,
  },
  { _id: false }
);
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
    updated: { type: Boolean, default: false },
    content: { type: String },
  imagesURLs: [file],
    videosURLs: [file],
    docsURLs: [file],
    read:
      { type: Boolean, default: false }
    
  },
  {
    timestamps: true,
  }
);
messageSchema.plugin(autoIncrement, { id: "messageID" });
module.exports = mongoose.model("messages", messageSchema);
