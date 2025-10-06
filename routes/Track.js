// routes/track.js
const express = require("express");
const router = express.Router();
const PageVisit = require("../model/PageVisit");

// كل زيارة تزود العداد +1
router.get("/", async (req, res) => {
  const visit = await PageVisit.findOneAndUpdate(
    {},
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );
  res.json({ totalVisits: visit.count });
});

// لو عايز تجيب العدد فقط من غير تزود
router.get("/count", async (req, res) => {
  const visit = await PageVisit.findOne({});
  res.json({ totalVisits: visit ? visit.count : 0 });
});

module.exports = router;
