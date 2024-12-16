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
    projectOwner:String,
    projectOwnerPhone:String,
    projectName: String,
    estateType: { type: String },
    governorate: { type: String },
    detailedAddress: { type: String },
    clientType: { type: String },
    locations:{
      type:Number,
      ref:"country"
    },
    governoate:{
      type:String,

    },
    pymentType: { type: String },
    estatePrice: { type: String },
    projectDetails:{type:String},
    projectNotes:{type:String},
    operationType: { type: String },
    installments: { type: String },
    installmentsPerYear: { type: String },
    installmentsFirstPyment: { type: String },
    installmentsFirstPermonth: { type: String },
    InstallmentPeriod:{type:String},
    areaMatter: { type: String },
    imagesURLs: [file],
    videosURLs: [file],
    docsURLs: [file],
    projectads:{
      type:String
    },
    RefereeStatus:{
      type:String
    } ,
    addedBy: { type: Number, ref: "users" },
  
    projectSatatus :{
      type:String,
     
   
    }  ,
    spaceOuteside :{
      type:String
    },
    typeOfSpaceoutside :{
      type:String,
    },
    imageLink :{
      type:String,
    },
    videoLink:{
      type:String,
    },
    cashPries:{
      type:String
    },
    materPriec:{
      type:String
    }
  },

  {
    timestamps: true,
  }
);


module.exports = mongoose.model("projects", projectSchema);
