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
   
    name: String,
    imagesURLs: [file],
    videosURLs: [file],
    docsURLs: [file],
    addedBy: { type: Number, ref: "users" },
    projectRequire:{
  
  },
  notes:{
    type:String
  }

  },

  {
    timestamps: true,
  }
);


module.exports = mongoose.model("PrivetProjects", PriverprojectSchema);