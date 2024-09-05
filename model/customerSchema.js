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
      enum: ["VIP", "New", "Regular"],
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
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("clients", customerSchema);
