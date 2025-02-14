const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const customerSchema = mongoose.Schema(
  {

    name: {
      type: String,
      trim:true

   
    },
    secoundName: {
      type: String,
      trim:true

    },
    phoneNumber: {
      type: String,
      trim:true,
      unique: true,

    },
    Section: {
      type: String,
      trim:true

    },
    AplicationType: {
      type: String,
   
    },
    numberusers: {
      type: String,
      trim:true

    },
 

    notes: {
      type: String,
      trim:true

    },

 
    addBy: {
       type: Number,
          ref: "users",
    },

    total:{
      type:String,
      trim:true

    },
    Paymenttype:{
      type:String
    }
    ,
    Arrievcashe :{
      type:String
    },
    inprocessCashe:{
      type:String,
      
    }
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("clients", customerSchema);
