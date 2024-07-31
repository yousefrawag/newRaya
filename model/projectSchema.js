const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const projectSchema = mongoose.Schema(
  {
    _id: Number,
    estateType: { type: String },
    governorate: { type: String },
    city: { type: String },
    estateNumber: { type: String },
    specificEstate: { type: String },
    clientType: { type: String },
    estatePrice: { type: Number },
    operationType: { type: String },
    installments: { type: String },
    installmentsPerYear: { type: Number },
    areaMatter: { type: String },
    finishingQuality: { type: String },
    // imagesVideos: [
    //   {
    //     type: String,
    //   },
    // ],
    // docs: [
    //   {
    //     type: String,
    //   },
    // ],
    addedBy: { type: Number, ref: "users" },
  },
  {
    timestamps: true,
  }
);
projectSchema.plugin(autoIncrement, { id: "projectID" });

module.exports = mongoose.model("projects", projectSchema);
