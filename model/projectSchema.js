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
  Section:{
    type:String,
  },
  customers:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"clients"
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
