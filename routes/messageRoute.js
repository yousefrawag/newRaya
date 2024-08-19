const express = require("express");
const {
  sendMessage,
  getChatMessages,
} = require("../controller/messageController");
const multerUpload = require("../middleware/multer");

const router = express.Router();

router.route("/").post(multerUpload.array("files"), sendMessage);
router.route("/:chatID").get(getChatMessages);
module.exports = router;
