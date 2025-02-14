const express = require("express");
const router = express.Router();
const {
  login,
  resetPassword,
  forgotPassword,
} = require("../controller/authController");
const {getDashboardStats} = require("../controller/Systemstatistics")

router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/Systemstatistics").get(getDashboardStats)
router.route("/login").post(login);
module.exports = router;
