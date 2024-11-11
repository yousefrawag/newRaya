const mongoose = require("mongoose");


const clientMeetingSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim:true
    },
    project: {
      type: String,
      trim:true
    },
    client: {
      type: String,
      trim:true
    },
    meetingDate: {
      type: Date,
    },
    meetingDetails: {
      type: String,
      trim:true

    },
    meetingResult: {
      type: String,
      trim:true

    },
    phoneNumber:{
        type:String,
        trim:true


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
