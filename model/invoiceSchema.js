const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema(
  {
 
    client: {
      type:mongoose.Schema.Types.ObjectId,
      ref: "clients",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model("invoices", invoiceSchema);
