const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const file = mongoose.Schema(
  {
    fileURL: String,
    fileID: String,
  },
  { _id: false }
);
const projectSchema = mongoose.Schema(
  {
    _id: Number,
    estateType: { type: String },
    governorate: { type: String },
    city: { type: String },
    estateNumber: { type: String },
    floor: { type: String, enum: ["upstairs", "ground floor"] },
    detailedAddress: { type: String },
    clientType: { type: String },
    estatePrice: { type: Number },
    operationType: { type: String },
    installments: { type: Boolean },
    installmentsPerYear: { type: Number },
    areaMatter: { type: String },
    finishingQuality: { type: String, enum: ["high ", "medium", "normal"] },
    imagesURLs: [file],
    videosURLs: [file],
    docsURLs: [file],
    addedBy: { type: Number, ref: "users" },
  },
  {
    timestamps: true,
  }
);
projectSchema.plugin(autoIncrement, { id: "projectID" });

module.exports = mongoose.model("projects", projectSchema);
