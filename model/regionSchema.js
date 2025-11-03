const mongoose = require("mongoose");
const regoineSchema = mongoose.Schema(
    {
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  relatedRegions: [
  String
]
      
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("regione" , regoineSchema)
