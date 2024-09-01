const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const expensesSchema = mongoose.Schema(
  {
    _id: Number,
    expenseName: {
      type: String,
    },
    projectName: {
      type: String,
    },
    expenseTotal: {
      type: String,
    },
    details: {
      type: String,
    },
    user:{
      type:Number,
      ref :"users"
    },
    adedBy:{
       type:Number,
      ref :"users"
    }
  },
  {
    timestamps: true,
  }
);

expensesSchema.plugin(autoIncrement, { id: "expenseID" });

module.exports = mongoose.model("expenses", expensesSchema);
