const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const notificationSchema = mongoose.Schema(
  {
    _id: Number,
    usersID: [{ type: Number, ref: "users" }],
    chatID: { type: Number, ref: "chats" },
    notificationType: { type: String, enum: ["toAdmin", "toEmployee"] },
    relatedMessages: [{ type: Number, ref: "messages" }],
    message: { type: String },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(autoIncrement, { id: "notificationID" });
module.exports = mongoose.model("notifications", notificationSchema);
