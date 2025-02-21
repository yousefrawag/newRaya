const mongoose = require("mongoose");


const file = mongoose.Schema(
  {
    fileURL: String,
    fileID: String,
  },
  { _id: false }
);
const projectSchema = mongoose.Schema(
  {
   
    name: {type:String},

  customers:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"clients"
  },
  section:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "section",
  },
  projectSatatus :{
    type:String,
    
  
  }  ,
    notes:{
      type:String
    },
  
    imagesURLs: [file],
    videosURLs: [file],
    docsURLs: [file],
    meetingDate:{
      type:Date
    },

    addedBy: { type: Number, ref: "users" },
  

   
    imageLink :{
      type:String,
    },
    videoLink:{
      type:String,
    },
  
  },

  {
    timestamps: true,
  }
);


module.exports = mongoose.model("projects", projectSchema);
