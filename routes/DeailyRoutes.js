const express = require("express");
const DeailyRpeorts = require("../controller/DeailyReport/DeailyReport")

const router = express.Router();

router.route("/").get( DeailyRpeorts);
module.exports = router;
