const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const customerSchema = mongoose.Schema(
  {
    _id: Number,
    fullName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    governorate: {
      type: String,
    },
    phoneNumber: [{ type: Number }],
    detailedAddress: {
      type: String,
    },
    cardNumber: {
      type: String,
    },
    type: {
      type: String,
      enum: ["client", "mediator"],
      default: "client",
    },
    imageURL: {
      type: String,
      default:
        "https://ps.w.org/user-avatar-reloaded/assets/icon-128x128.png?rev=2540745",
    },
    imageID: String,
  },
  {
    timestamps: true,
  }
);
customerSchema.plugin(autoIncrement, { id: "customerID" });

module.exports = mongoose.model("customers", customerSchema);
