const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const customerSchema = mongoose.Schema(
  {

    fullName: {
      type: String,
      trim:true

   
    },
    region: {
      type: String,
      trim:true

    },
    phoneNumber: {
      type: String,
      trim:true,
      unique: true,

    },
    secondaryPhoneNumber: {
      type: String,
      trim:true

    },
    currency: {
      type: String,
   
    },
    source:{
      type:String
    } ,
    firstPayment: {
      type: String,
      trim:true

    },
    clientStatus: {
      type: String,
      trim:true,
  
    },
    project: {
      type:String,
      trim:true
    },
    notes: {
      type: String,
      trim:true

    },
    clientRequire: {
      type: [String],
   

    },
    clientendRequr: {
      type: String,
      trim:true

    },
    governote: {
      type:String,
      trim:true
    },   
    addBy: {
      type:String,
      trim:true
    },
    cashOption:{
      type:String,
      trim:true

    },
    Paymentpermonth:{
      type:Number,
      trim:true
    },
    userfollow:{
    type:String,
      trim:true
    },
     clientwork:{
    type:String,
      trim:true
    },
    InstallmentType:{
          type:String,
      trim:true
    },
    installmentsPyYear:{
      type:String,
      trim:true

    },
    endContactDate:{
      type:Date
    }
    ,
    customerDate :{
      type:Date
    },
    isViwed:{
      type:String,
      trim:true
    },
    SectionFollow: [{
      details: {
        type: String
      },
      detailsDate: {
        type: Date,
      },
      user: {
        type: Number,
        ref: "users",
      },
      CustomerDealsatuts:{
        type:String
      },
      createdAt: {
        type: Date,
        default: Date.now // Automatically sets the creation date
      }
    }] ,
    
    ArchievStatuts :{
      type:Boolean ,
      default:false
    } ,
    email:{
      type:String
    } ,
  moduleType:{
    type:String ,
    enum:["lead" , "customer"]
  },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("clients", customerSchema);
