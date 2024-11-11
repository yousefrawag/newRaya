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
      required: true,
      trim:true

    },
    phoneNumber: {
      type: String,
      required: true,
      trim:true

    },
    secondaryPhoneNumber: {
      type: String,
      trim:true

    },
    currency: {
      type: String,
      required: true,
    },
    firstPayment: {
      type: String,
      trim:true

    },
    clientStatus: {
      type: String,
      trim:true,
      required: true,
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
      type: String,
      trim:true

    },
    clientendRequr: {
      type: String,
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
    }
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("clients", customerSchema);
