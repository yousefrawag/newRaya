const mongoose = require("mongoose");

const PayvoucherSchema = mongoose.Schema(
  {
 
 payFor:{
  type:String,
  trim:true
 },
  totalPrice:{
    type:String,
    trim:true
  },
  TotalPriceDolar:{
      type:Number
  },
   ThatFor:{
    type:String,
    trim:true
   },
    SignatureBy: {
    type:String,
    trim:true
    },

    notes: String,
 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("payvoucher", PayvoucherSchema);
