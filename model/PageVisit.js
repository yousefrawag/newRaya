// model/PageVisit.js
const mongoose = require("mongoose");

const pageVisitSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model("PageVisit", pageVisitSchema);
