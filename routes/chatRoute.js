const express = require("express");
const { createChat } = require("../controller/chatController");
const { create } = require("../middleware/validations/chatValidator");
const router = express.Router();

router.route("/").post(create, createChat);
module.exports = router;
