const notificationSchema = require("../model/notificationSchema");
const missionSchema = require("../model/missionSchema")
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
      }).sort({ createdAt: -1 });
      const missions = await missionSchema.find()
      const missionsAvilbaile = new Set(missions.map((item) => item._id)) 
       vaildateNovcations = notifications.filter((item)  => {
        const missionid = item.chatID.missionID._id
        return   missionid && missionsAvilbaile.has(missionid);
       })

    return res.status(200).json({ notifications});
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
