const express = require("express");
const  Player  = require("../model/player");

const router = express.Router();

// إنشاء لاعب جديد أو تحديثه
router.post("/update", async (req, res) => {
  const { name, carType, latitude, longitude } = req.body;
  if (!name || !carType) return res.status(400).json({ message: "الاسم ونوع السيارة مطلوبان" });

  const center = { latitude: 24.785132, longitude: 46.661436 }; // كودو
  const R = 6371e3;
  const φ1 = (latitude * Math.PI) / 180;
  const φ2 = (center.latitude * Math.PI) / 180;
  const Δφ = ((center.latitude - latitude) * Math.PI) / 180;
  const Δλ = ((center.longitude - longitude) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const isOutsideCircle = distance > 29000; // 10 كم دائرة البداية

  let player = await Player.findOne({ name });
  if (player) {
    player.latitude = latitude;
    player.longitude = longitude;
    player.distanceFromCenter = distance;
    player.isOutsideCircle = isOutsideCircle;
    player.lastUpdate = Date.now();
    await player.save();
  } else {
    player = await Player.create({ name, carType, latitude, longitude, distanceFromCenter: distance, isOutsideCircle });
  }

  res.json({ success: true, player });
});

// جلب جميع اللاعبين (للأدمن)
router.get("/", async (req, res) => {
  const players = await Player.find().sort({ lastUpdate: -1 });
  res.json(players);
});
router.get("/:id", async (req, res) => {
  const {id} = req.params
  const players = await Player.findById(id);
  res.json(players);
});
module.exports = router;