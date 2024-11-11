const chatSchema = require("../model/chatSchema");
const messageSchema = require("../model/messageSchema");
const notificationSchema = require("../model/notificationSchema");
const userSchema = require("../model/userSchema");
const cloudinary = require("../middleware/cloudinary");
const nodemailer = require("nodemailer")
exports.sendMessage = async (req, res, next) => {
  try {
    const { chatID, senderID, content } = req.body;

    const user = await userSchema.findOne({ _id: senderID });
    const chat = await chatSchema.findOne({ _id: chatID }).populate("employeeID").populate("missionID");
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
        [chat.employeeID._id],
        chatID,
        "toEmployee",
        message,
        user
      );
      setImmediate(() => {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASS,
          },
        });
  
        const mailOptions = {
          from: "alrayapalms@gmail.com",
          to: chat?.employeeID?.email,
          subject: "New Message",
          html: `
              <p>Dear ${chat?.employeeID.fullName},</p>
              <p>You have received a New Message From Mission <span style="color:#218bc7">${chat?.missionID?.title}</span> </p>
             <p style="display:block">From Admin: 
                <img src="${user?.imageURL}" width="60" height="60" style="border-radius: 50%; margin-bottom: 15px  ; display:block" />
                ${user.fullName}
            </p>
              <p>message: ${content}</p>
              <p>Make sure to open Your Account And Check it</p>
              <a href="${process.env.CLIENT_URL}/reportDetails/${chat?.missionID?._id}/${chat?.employeeID._id}" style="display: inline-block; padding: 10px 20px; background-color: #218bc7; color: white; text-decoration: none; border-radius: 5px;">View Chat</a>
          `,
      };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      });
      return res
        .status(200)
        .json({ message: "Message sent successfully", message });
    }

    if (user.type === "employee") {
    
      if (chat.employeeID._id != senderID) {

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
      const missionTitle =  chat?.missionID?.title
      const missionId = chat?.missionID?._id
      const empId = chat?.employeeID?._id
  await sendingMailesToadmins(user , chatID , missionTitle , content , missionId , empId)
        
           return res
        .status(200)
        .json({ message: "Message sent successfully", message });
    


} }catch (error) {
   throw new Error(error)
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
const sendingMailesToadmins = async (user , chatid , missionTitle , content , missionID , empId) => {
      const users = await notificationSchema.find({ chatID: chatid }).populate("usersID");
      console.log(users[users.length - 1]?.usersID)
      users[users.length - 1]?.usersID?.map((item) => {
        return (
           setImmediate(() => {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASS,
          },
        });
  
        const mailOptions = {
          from: "alrayapalms@gmail.com",
          to: item?.email,
          subject: "New Message",
          html: `
              <p>Dear ${item?.fullName},</p>
              <p>You have received a New Message From Mission <span style="color:#218bc7">${missionTitle}</span> </p>
             <p style="display:block">From Employee: 
                <img src="${user?.imageURL}" width="60" height="60" style="border-radius: 50%; margin-bottom: 15px  ; display:block" />
                ${user.fullName}
            </p>
              <p>message: ${content}</p>
              <p>Make sure to open Your Account And Check it</p>
              <a href="${process.env.CLIENT_URL}/reportDetails/${missionID}/${empId}"  style="display: inline-block; padding: 10px 20px; background-color: #218bc7; color: white; text-decoration: none; border-radius: 5px;">View Chat</a>
          `,
      };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      })
        )
        })
  }
