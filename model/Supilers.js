const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    phones: [
      {
        type: String,
        trim: true,
      },
    ],

    emails: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    products: [
      {
        productName: {
          type: String,
          required: true,
          trim: true,
        },

        category: {
          type: String,
          trim: true,
        },

        wholesalePrice: {
          type: Number,
          min: 0,
        },

        currency: {
          type: String,
          default: "USD",
          trim: true,
        },
      },
    ],

    notes: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Supplier", supplierSchema);