const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  carType: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  distanceFromCenter: Number,
  isOutsideCircle: Boolean,
  lastUpdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Player", playerSchema);
