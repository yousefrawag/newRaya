const chatSchema = require("../model/chatSchema");
const messageSchema = require("../model/messageSchema");
const notificationSchema = require("../model/notificationSchema");
const userSchema = require("../model/userSchema");
const cloudinary = require("../middleware/cloudinary");
const nodemailer = require("nodemailer");
const missionSchema = require("../model/missionSchema")
const path = require("path");
const { log } = require("console");
const logo = path.join(__dirname, "../images/logo2.jpg");

exports.sendMessage = async (req, res) => {
  try {
    const { chatID, content, senderID } = req.body;

    let chat = await chatSchema.findById(chatID).populate("participants").populate("missionID");
console.log(chat)
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // If participants are empty, fetch from the mission and update chat
    if (!chat.participants || chat?.participants?.length === 0) {
      const mission = await missionSchema.findById(chat.missionID).populate("assignedTo");
      if (mission && mission.participants.length > 0) {
        chat.participants = mission.participants.map(user => user._id);
        await chat.save();
        console.log("✅ Updated chat participants:", chat.participants);
      }
    }

    // Create new message
    const newMessage = new messageSchema({
      chatID,
      senderID: senderID,
      content,
    });

    await newMessage.save();
const user = await userSchema.findById(senderID)
    // Send notifications
    handleNotifications(chat.participants, chatID, newMessage, user);
    sendEmailNotifications(chat.participants, chat, user, content);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("🚨 Error sending message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const handleNotifications = async (usersID, chatID, message, user) => {
  try {
    // console.log("📨 يتم إرسال  اشعار إلى المشاركين:", usersID);
    const notifications = usersID.map(
      (id) =>
        new notificationSchema({
          usersID: [id],
          chatID,
          relatedMessages: [message._id],
          message: `لديك رسالة من ${user.name}: ${message.content}`,
          read: false,
        })
    );

    await notificationSchema.insertMany(notifications);
  } catch (error) {
    console.error("Error handling notification:", error);
  }
};

const sendEmailNotifications = async (participants, chat, sender, content) => {
  try {
    // console.log("📨 يتم إرسال البريد الإلكتروني إلى المشاركين:", chat);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });

    for (const participant of participants) {
      const user = await userSchema.findById(participant);
      if (!user || !user.email) continue;

      const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: user.email,
        subject: "💬 رسالة جديدة في محادثة المهمة",
        html: `
          <div style="direction: rtl; text-align: center; font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
            <img src="cid:logo" style="width: 150px; border-radius: 10px;" alt="شعار الشركة">
            
            <h2 style="color: #333;">💬 لديك رسالة جديدة</h2>
            
            <p style="font-size: 18px; color: #555; margin-bottom: 10px;">
              <strong>📌 عزيزي ${user.name},</strong>
            </p>
            
            <p style="font-size: 16px; color: #444; background: #fff; padding: 15px; border-radius: 10px; box-shadow: 0px 3px 6px rgba(0,0,0,0.1);">
              <span style="color: #218bc7;">${chat.missionID.title}</span>
              <br>
              <strong>👤 من: </strong> ${sender.name} <br>
              <strong>💬 الرسالة:</strong> ${content}
            </p>

            <p style="font-size: 16px; color: #777; margin-top: 10px;">اضغط على الزر أدناه لعرض المحادثة:</p>

            <a href="${process.env.CLIENT_URL}/team-chat/${chat._id}/${chat?.missionID}"
              style="display: inline-block; padding: 12px 20px; background-color: #218bc7; color: white; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 8px; box-shadow: 0px 2px 5px rgba(0,0,0,0.2);">
              📩 عرض المحادثة
            </a>

            <p style="font-size: 14px; color: #999; margin-top: 20px;">🚀 فريق العمل الخاص بك</p>
          </div>
        `,
        attachments: [
          {
            filename: "logo2.jpg",
            path: logo, // Ensure correct path
            cid: "logo", // Content ID for inline display
          },
        ],
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) console.error("🚨 Error sending email:", error);
      });
    }
  } catch (error) {
    console.error("❌ Error sending email notifications:", error);
  }
};


exports.getChatMessages = async (req, res, next) => {
  try {
    const { chatID } = req.params;
    const messages = await messageSchema.find({ chatID }).sort({ createdAt: 1 }).populate("senderID");
    return res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};
