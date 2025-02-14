const express = require("express");
const { addMessage, getAllMessages, getMessageById, deleteMessage, updateMessage } = require("../controller/CustomerMessages");

const router = express.Router();

router.route("/").post(addMessage).get(getAllMessages);
router.route("/:id").get(getMessageById).put(updateMessage).delete(deleteMessage);

module.exports = router;
