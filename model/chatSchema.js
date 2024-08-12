const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const chatSchema = mongoose.Schema(
  {
    _id: Number,
    employeeID: {
      type: Number,
      ref: "users",
    },
    missionID:{
      type:Number,
      ref:"missions"
    }
  },
  {
    timestamps: true,
  }
);
chatSchema.plugin(autoIncrement, { id: "chatID" });
module.exports = mongoose.model("chats", chatSchema);
