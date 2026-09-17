const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const clientRequirementSchema = new mongoose.Schema({
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
}, { _id: false });
const importcustomerSchema = mongoose.Schema(
  {

    fullName: {
      type: String,
      trim:true

   
    },
    source:{
type:String ,
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
    customerType: {
      type: String,
   
    },
     interestType: {
      type: String,
   
    },
    priority:{
        type: String,
    },


    clientStatus: {
      type: String,
      trim:true,
  
    },


    notes: {
      type: String,
      trim:true

    },

      clientRequirements: {
    type: [clientRequirementSchema], // مصفوفة من الطلبات
    default: [],
  },


  
    addBy: {
       type: Number,
        ref: "users",
    },


    userfollow:{
    type:String,
      trim:true
    },
  




    SectionFollow: [{
      lastContact: {
        type: String
      },
      detailsDate: {
        type: Date,
      },
      user: {
        type: Number,
        ref: "users",
      },
      followUpType:{
        type:String
      },
         followUpStatus:{
        type:String
      },
            followUpStatusDesc:{
        type:String
      },

      followUpNotes:{
         type:String
      },
      lengthofFollow:{
        type:Number,
        default:0
      },
        lengthofRequest:{
        type:Number,
        default:0
      },

      nextReminderDate:{
type:Date
      } ,
      createdAt: {
        type: Date,
        default: Date.now // Automatically sets the creation date
      } ,
      meeting:{
         type: Date,
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
    enum:["lead" , "customer" , "underReview"]
  },

  relatedStauts:{
       type:String
  }

  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("importclients", importcustomerSchema);
