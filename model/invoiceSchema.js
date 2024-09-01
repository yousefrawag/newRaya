const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const invoiceSchema = mongoose.Schema(
  {
    _id: Number,
    client: {
      type: Number,
      ref: "clients",
    },
    project: {
      type: Number,
      ref: "projects",
    },
    estateType: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue", "canceled"],
      default: "pending",
    },
    total: {
      type: String,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);
invoiceSchema.plugin(autoIncrement, { id: "invoiceID" });
module.exports = mongoose.model("invoices", invoiceSchema);
