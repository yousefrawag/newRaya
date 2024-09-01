const express = require("express");
const { createChat } = require("../controller/chatController");
const { create } = require("../middleware/validations/chatValidator");
const authuserViewhasMission = require("../middleware/authuserViewhasMission");

const router = express.Router();

router.route("/").post(authuserViewhasMission("canViewReports"), create, createChat);
module.exports = router;
