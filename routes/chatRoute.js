const express = require("express");
const { createChat } = require("../controller/chatController");
const { create } = require("../middleware/validations/chatValidator");
const authorizationMW = require("../middleware/authorizationMW");

const router = express.Router();

router.route("/").post(authorizationMW("canViewReports"), create, createChat);
module.exports = router;
