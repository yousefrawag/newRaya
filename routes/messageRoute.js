const express = require("express");
const {
  sendMessage,
  getChatMessages,
  DeleateMessage,
  UpdateMessage
} = require("../controller/messageController");
const multerUpload = require("../middleware/multer");
const protect = require("../middleware/authenticationMW")

const router = express.Router();
router.use(protect)
router.route("/").post(multerUpload.array("files"), sendMessage);
router.route("/:chatID").get(getChatMessages);
router.route("/:id").delete(DeleateMessage).put(UpdateMessage)

module.exports = router;
