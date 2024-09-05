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
    estatePrice: { type: Number },
    projectDetails:{type:String},
    projectNotes:{type:String},
    operationType: { type: String },
    installments: { type: String },
    installmentsPerYear: { type: Number },
    installmentsFirstPyment: { type: Number },
    installmentsFirstPermonth: { type: Number },
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
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("projects", projectSchema);
