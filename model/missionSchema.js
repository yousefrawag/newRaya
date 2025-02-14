const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const missionSchema = mongoose.Schema(
  {
    _id: Number,
    title: {
      type: String,
    },

    description: {
      type: String,
    },
    deadline: Date,
    status: {
      type: String,
      enum: ["فى تقدم", "مكتملة" , "مغلقة"],
      default: "فى تقدم",
    },
    missionType:{
      type:String,
      enum:["مشروع عام" , "مشروع خاص"]
    },
    assignedTo:[
      {
        type: Number,
        ref: "users",
      }
    ] ,
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
    },
    Privetproject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PrivetProjects",
    },
    requirements:[
      {
        type:{type:String},
        complated:{type:Boolean , default:false},
        userEdit:{
          type: Number,
          ref: "users",
        }
      }
    ],
    section:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
    },
    assignedBy: {
      type: Number,
      ref: "users",
    },
    chatID: {
      type: Number,
      ref: "chats",
    },
  },
  {
    timestamps: true,
  }
);
missionSchema.plugin(autoIncrement, { id: "missionID" });

module.exports = mongoose.model("missions", missionSchema);
