const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const missionSchema = mongoose.Schema(
  {
   

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
      enum:["مشروع خاص" , "مشروع عام"]
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
missionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "project", // Populate the `project` field

  })
    .populate({
      path: "Privetproject", // Populate the `Privetproject` field
     
    })
    .populate({
      path: "assignedBy", // Populate the `assignedBy` field
    
    })
    .populate({
      path: "assignedTo", // Populate the `assignedTo` field (array of user IDs)
    
    })
    .populate({
      path: "requirements.userEdit", // Populate the `userEdit` field inside `requirements`
    
    });

  next();
});

module.exports = mongoose.model("missions", missionSchema);
