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
    EstateType: {
      type: String,
    },
    expenseTotal: {
      type: String,
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

expensesSchema.plugin(autoIncrement, { id: "expenseID" });

module.exports = mongoose.model("expenses", expensesSchema);
