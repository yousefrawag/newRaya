const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const customerSchema = mongoose.Schema(
  {
    _id: Number,
    fullName: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    secondaryPhoneNumber: {
      type: String,
    },
   
    currency: {
      type: String,  // Add more options as necessary
      required: true,
    },
    firstPayment: {
      type: String,
      required: true,
    },
    clientStatus: {
      type: String,
      enum: ["VIP", "New" , "Regular"],  // Modify the statuses as necessary
      required: true,
    },
    project: {
      type: Number,
       ref:"projects"
    },

    notes: {
      type: String,
    },
    clientRequire:{
      type:String,
    },
    clientendRequr:{
      type:String
    },
    addBy:{
      type: Number,
      ref:"users"
    }
  },
  {
    timestamps: true,
  }
);

customerSchema.plugin(autoIncrement, { id: "clientID" });

module.exports = mongoose.model("clients", customerSchema);

