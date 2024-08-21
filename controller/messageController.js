const chatSchema = require("../model/chatSchema");
const messageSchema = require("../model/messageSchema");
const notificationSchema = require("../model/notificationSchema");
const userSchema = require("../model/userSchema");
const cloudinary = require("../middleware/cloudinary");

exports.sendMessage = async (req, res, next) => {
  try {
    const { chatID, senderID, content } = req.body;

    const user = await userSchema.findOne({ _id: senderID });
    const chat = await chatSchema.findOne({ _id: chatID });
    const filesURLs = [];
    if (req.files) {
      for (const index in req.files) {
        const { imageURL: fileURL, imageID: fileID } = await cloudinary.upload(
          req.files[index].path,
          "chatsFiles"
        );
        filesURLs.push({ fileURL, fileID });
      }
    }
    if (user.type === "admin") {
      const message = new messageSchema({ chatID, senderID, content })
      message.filesURLs = filesURLs;
      await message.save();
      await handelNotifications(
        [chat.employeeID],
        chatID,
        "toEmployee",
        message,
        user
      );

      return res
        .status(200)
        .json({ message: "Message sent successfully", message });
    }

    if (user.type === "employee") {
      if (chat.employeeID != senderID) {
        return res
          .status(403)
          .json({ message: "This user is unauthorized to send a message" });
      }

      const message = new messageSchema({ chatID, senderID, content })
      message.filesURLs = filesURLs;
      await message.save();
      const users = await userSchema.find({ type: "admin" });

      await handelNotifications(
        users.map((user) => user._id),
        chatID,
        "toAdmin",
        message,
        user
      );

      return res
        .status(200)
        .json({ message: "Message sent successfully", message });
    }
  } catch (error) {
    next(error);
  }
};
const handelNotifications = async (
  usersID,
  chatID,
  notificationType,
  message,
  user
) => {
  try {
    let notification = await notificationSchema.findOne({
      usersID,
      chatID,
      notificationType,
    });

    if (notification) {
      notification.relatedMessages.push(message._id);
      notification.message = `You have new messages from ${user.type}: ${message.content}`;
      notification.read = false;
      await notification.save();
    } else {
      notification = new notificationSchema({
        usersID,
        chatID,
        notificationType,
        relatedMessages: [message._id],
        message: `New message from ${user.type}: ${message.content}`,
      });

      await notification.save();
    }
  } catch (error) {
    console.error("Error handling notification:", error);
  }
};

exports.getChatMessages = async (req, res, next) => {
  try {
    const { chatID } = req.params;
    const messages = await messageSchema
      .find({ chatID })
      .sort({ createdAt: 1 }).populate("chatID").populate("senderID");
    return res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};
