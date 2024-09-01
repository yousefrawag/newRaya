const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const clientMeetingSchema = mongoose.Schema(
  {
    _id: Number,
    title: {
      type: String,
    },
    project: {
      type: Number,
      ref: "projects"
    },
    client: {
      type: Number,
      ref: "clients"
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
    phoneNumber:{
        type:String,

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

clientMeetingSchema.plugin(autoIncrement, { id: "clientMeetingID" });

module.exports = mongoose.models.clientmeeting || mongoose.model("clientmeeting", clientMeetingSchema);
