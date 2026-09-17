const mongoose = require("mongoose");

const ImportexportOraeders = new mongoose.Schema({
    clientId:{
    type: mongoose.Schema.Types.ObjectId,
        ref: "importclients",
    },
  opeartionType: {
    type: String,
    
    trim: true,
  },
  productName: {
    type: String,
   
    trim: true,
  },
  productCategory: {
    type: String,
 
    trim: true,
  },
  quantity: {
    type: String,
 
    trim: true,
  },
    quantityUnit: {
    type: String,
 
    trim: true,
  },
    productSpecifications: {
    type: String,
 
    trim: true,
  },
    producingCountry: {
    type: String,
 
    trim: true,
  },
    producingCity: {
    type: String,
 
    trim: true,
  },

      receivingCity: {
    type: String,
 
    trim: true,
  },
      receivingAddress: {
    type: String,
 
    trim: true,
  },
      shippingType: {
    type: String,
 
    trim: true,
  },
      containerQuantity: {
    type: String,
 
    trim: true,
  },
      targetPrice: {
    type: String,
 
    trim: true,
  },
  
      currency: {
    type: String,
 
    trim: true,
  },
  
      requiredDeliveryDate: {
    type: Date,
 
    trim: true,
  },
  
      supplierRequired: {
    type: String,
 
    trim: true,
  },
    
      customsRequired: {
    type: String,
 
    trim: true,
  },
    
      status: {
    type: String,
 
    trim: true,
  },
    
      notes: {
    type: String,
 
    trim: true,
  },
},   {
    timestamps: true,
  });
module.exports =  mongoose.model("ImportexportOraeders", ImportexportOraeders);