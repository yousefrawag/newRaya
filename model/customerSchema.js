const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const customerSchema = mongoose.Schema(
  {

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
      type: String,
      required: true,
    },
    firstPayment: {
      type: String,
      required: true,
    },
    clientStatus: {
      type: String,
      enum: ["VIP عميل", "عميل محتمل", "عميل من خلال بنك"],
      default:"VIP عميل",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
    },
    notes: {
      type: String,
    },
    clientRequire: {
      type: String,
    },
    clientendRequr: {
      type: String,
    },
    addBy: {
      type: Number,
      ref: "users",
    },
    cashOption:{
      type:String,
      enum:["كاش" , "غير متاح"],
      default:"غير متاح"
    },
    installmentsPyYear:{
      type:String
    },
    endContactDate:{
      type:Date
    }
    ,
    customerDate :{
      type:Date
    }
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("clients", customerSchema);
