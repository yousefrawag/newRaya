// models/Property.js
const mongoose = require('mongoose');
const file = mongoose.Schema(
  {
    fileURL: String,
    fileID: String,
  },
  { _id: false }
);
const propertySharedSchema = new mongoose.Schema(
  {
    client: {
      fullName: { type: String, required: true },
      email: { type: String },
      phone: { type: String, required: true },
      company: { type: String, default: '' }
    },
    status:{
        type:String ,
        default:"جديد"
    },
    project: {
      estateType: { type: String, required: true },
      governoate: { type: String, required: true },
      city: { type: String, required: true },
      projectSatatus: { type: String, required: true },
      operationType: { type: String, required: true },
      areaMatter: { type: String },
      internalArea: { type: String},
      spaceOuteside: { type: String },
      typeOfSpaceoutside: { type: String },
      installments: { type: String, enum: ['نعم', 'لا'], required: true },
      estatePrice: { type: Number, default: null },
      materPriec: { type: Number, default: null },
      installmentsFirstPyment: {
        type: Number,

      },
      plotNumber: { type: String, default: '' },
      basinNumber: { type: String, default: '' },
      projectDetails: { type: String, required: true },
      imagesURLs:  [file]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PropertyShared', propertySharedSchema);