const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const customerSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
});

const campaignSchema = new mongoose.Schema(
  {
    _id: Number,
    title: String,
    user: { type: Number, ref: "users" },
    customerType:String ,
    message: String,
    link: String,
    imageUrl: String,
    customers: [customerSchema],
    status: {
      type: String,
      enum: ["draft", "sending", "sent", "failed"],
      default: "draft",
    },
    totalCount: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

campaignSchema.plugin(autoIncrement, { id: "campaignID" });

module.exports = mongoose.model("Campaign", campaignSchema);
