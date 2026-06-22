const mongoose = require("mongoose");


const file = mongoose.Schema(
  {
    fileURL: String,
    fileID: String,
  },
  { _id: false }
);
const propertySchema = new mongoose.Schema({
  floorType: String,
  floorTypeFlow: String,
  floorNumber: String,
  areaOutside: String,
  areaTarth: String,
  areaBark: String,
  floor: String,
  rooms: String,
  bathrooms: String,
  area: String,
  price: Number,
  downPayment: Number,
  monthlyInstallment: Number,
  propertyNote: String,
  customers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "clients",
  }],
  propertyStatus: {
    type: String,
    default: "متاحة"
  },
  FloorDetails: String,
  imagesURLs: [file],
  videosURLs: [file],
  docsURLs: [file],
}, {
  timestamps: true // timestamps هنا
});
const projectSchema = mongoose.Schema(
  {
    projectOwner:String,
    projectOwnerPhone:String,
    projectName: String,
    estateType: { type: String },
    governorate: { type: String },
    detailedAddress: { type: String },
    clientType: { type: String },
    // locations:{
    //   type:Number,
    //   ref:"country"
    // },
    governoate:{
      type:String,

    },
    pymentType: { type: String },
    estatePrice: { type: String },
     RoofPrice: { type: String },
     PriceLand:{ type: String },
    VailePrice:{ type: String },
     upEstatePrice: { type: String },
    projectDetails:{type:String},
    partmentFirstInstallment:{ type: String },
     VaileFirstInstallment:{ type: String },
      RoofFirstInstallment:{ type: String },
      buildingAge:{ type: String },
      partmentDownMater:{type:String},
      LandMater:{type:String},
      VaileMater:{type:String},
      RoofMater:{type:String},
    ProjectDelivery:{type:String},
    projectNotes:{type:String},
  
    properties:
    [propertySchema],
    operationType: { type: String },
    installments: { type: String },
    installmentsPerYear: { type: String },
    installmentsFirstPyment: { type: String },
    installmentsFirstPermonth: { type: String },
    InstallmentPeriod:{type:String},
    areaMatter: { type: String },
status: {
  type: String,
  enum: ["archiev", "process"],
  default: "process"
}
 ,
    city:{
      type:String
    },
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
    } ,
    relatedtype:{
  type:String
    } ,
    availableFloors:[] ,
     Barkaaraemater :{
   type:String
 } ,
 countOfperiod:{
  type:Number
 } ,
 installmentPeriod:{
  type:String
 }
  },


  {
    timestamps: true,
  }
);


module.exports = mongoose.model("projects", projectSchema);
