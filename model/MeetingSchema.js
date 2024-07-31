const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const meetingSchema = mongoose.Schema(
  {
    _id: Number,
    title: {
      type: String,
    },
    meetingDate: {
      type: Date,
    },
    meetingDetails: {
      type: String,
    },
    meetingResult: {
      type: String,
    },
    addedBy: {
      type: Number,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

if (!mongoose.models.meetings) {
  meetingSchema.plugin(autoIncrement, { id: "meetingID" });
}

module.exports =
  mongoose.models.meetings || mongoose.model("meetings", meetingSchema);
