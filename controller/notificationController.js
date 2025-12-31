const notificationSchema = require("../model/notificationSchema");
const missionSchema = require("../model/missionSchema")
exports.getUserNotifications = async (req, res, next) => {
  try {
    const { id } = req.params;

   
const notifications = await notificationSchema
  .find({
    user: id,
    read: false,
  })
  .populate("user") // Populating user details
  .populate("employee") // Populating employee details
  .populate("allowed")
  .sort({ createdAt: -1 }) // آخر إشعارات الأول
  .limit(60)



    return res.status(200).json({ notifications: notifications });  // Send valid data only
  } catch (error) {
    next(error);
  }
};


exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedNotifications = await notificationSchema.updateMany(
      { user: id, read: false }, // Filter by user ID and unread notifications
      { $set: { read: true } } // Mark as read
    );

    return res.status(200).json({ message: "All notifications marked as read", updatedNotifications });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const { notificationId, id } = req.params;

    const notification = await notificationSchema.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (
      notification.usersID.length === 1 &&
      notification.usersID[0] == id
    ) {
      await notificationSchema.findByIdAndDelete(notificationId);
      return res.status(200).json({ message: "Notification deleted" });
    } else {
      await notificationSchema.findByIdAndUpdate(
        notificationId,
        { $pull: { usersID: id } },
        { new: true }
      );
      return res.status(200).json({ message: "Notification deleted" });
    }
 
  } catch (error) {
   next(error)
  }
};
