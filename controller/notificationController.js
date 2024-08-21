const notificationSchema = require("../model/notificationSchema");

exports.getUserNotifications = async (req, res, next) => {
  try {
    
    const { id } = req.params;

    const notifications = await notificationSchema
      .find({
        usersID: { $in: [id] },
      })
      .populate({
        path: "chatID",
        populate: {
          path: "missionID",
        },
      });

    return res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
};

exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedNotification = await notificationSchema.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res
      .status(200)
      .json({ message: "Notification marked as read", updatedNotification });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const { notificationID, userID } = req.params;

    const notification = await notificationSchema.findById(notificationID);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (
      notification.usersID.length === 1 &&
      notification.usersID[0] == userID
    ) {
      await notificationSchema.findByIdAndDelete(notificationID);
      return res.status(200).json({ message: "Notification deleted" });
    } else {
      await notificationSchema.findByIdAndUpdate(
        notificationID,
        { $pull: { usersID: userID } },
        { new: true }
      );
      return res.status(200).json({ message: "Notification deleted" });
    }
    res.json("failed");
  } catch (error) {
    next(error);
  }
};
