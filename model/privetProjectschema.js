const mongoose = require("mongoose");


const file = mongoose.Schema(
  {
    fileURL: String,
    fileID: String,
  },
  { _id: false }
);
const PriverprojectSchema = mongoose.Schema(
  {
   
    projectName: String,
    imagesURLs: [file],
    videosURLs: [file],
    docsURLs: [file],
    addedBy: { type: Number, ref: "users" },
        ArchievStatuts :{
      type:Boolean ,
      default:false
    } ,
    projectDetails:String,
  notes:{
    type:String
  }

  },

  {
    timestamps: true,
  }
);


module.exports = mongoose.model("PrivetProjects", PriverprojectSchema);