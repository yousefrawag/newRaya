const express = require("express");
const { sendMessage } = require("../controller/messageController");
const multerUpload = require("../middleware/multer");

const router = express.Router();

router.route("/").post(multerUpload.array("files"), sendMessage);
module.exports = router;
