const express = require("express");

const {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require("../controller/notificationController");

const router = express.Router();
router.route("/:id").get(getUserNotifications);
router.route("/:id").patch(markNotificationAsRead);
router.route("/:notificationId/:id").delete(deleteNotification);

module.exports = router;
