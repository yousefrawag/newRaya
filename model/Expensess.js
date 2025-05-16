const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const expenssSchema = mongoose.Schema(
  {

    user:{ type: Number, ref: "users" },
    type:String ,
    total:Number,
    curenccy: { type: String },
    notes:String

  
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("expensess", expenssSchema);
