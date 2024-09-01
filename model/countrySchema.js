const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
  {
    countryName: {
      type: String,
    },
    locations: [{
      type: String,
    }],
  },
  {
    timestamps: true, // Moved outside the schema fields
  }
);

module.exports = mongoose.model("country", customerSchema);
