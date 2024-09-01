const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const customerSchema = mongoose.Schema(
  {
    _id:Number ,
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
customerSchema.plugin(autoIncrement, { id: "countryID" });

module.exports = mongoose.model("country", customerSchema);
