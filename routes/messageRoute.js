const express = require("express");
const {
  sendMessage,
  getChatMessages,
} = require("../controller/messageController");
const multerUpload = require("../middleware/multer");
const protect = require("../middleware/authenticationMW")

const router = express.Router();
router.use(protect)
router.route("/").post(multerUpload.array("files"), sendMessage);
router.route("/:chatID").get(getChatMessages);
module.exports = router;
