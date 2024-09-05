const mongoose = require("mongoose");


const clientMeetingSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects"
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
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



module.exports = mongoose.models.clientmeeting || mongoose.model("clientmeeting", clientMeetingSchema);
