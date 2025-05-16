const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const notificationSchema = mongoose.Schema(
  {
    _id: Number,
    user:{ type: Number, ref: "users" },
    employee:{ type: Number, ref: "users" },
    levels: {
      type: String,
      enum: ["projects", "users", "clients" , "missions" , "expensess"],
      required: true,
    },
    type:{
      type: String,
      enum: ["add", "update", "delete" , "message"],
      required: true,
    },
 
    message: { type: String },
    allowed: {
      type:mongoose.Schema.Types.ObjectId,
      refPath: "levels",
    },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(autoIncrement, { id: "notificationID" });
module.exports = mongoose.model("notifications", notificationSchema);
