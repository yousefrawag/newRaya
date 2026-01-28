const missionSchema = require("../../model/missionSchema");
const chatSchema = require("../../model/chatSchema");
const nodemailer = require("nodemailer");
const path = require("path");
const logo = path.join(__dirname, "../../images/logo2.png");
const projectSchema = require("../../model/projectSchema")
const notificationSchema = require("../../model/notificationSchema");
const updateMission = async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    status,
    assignedTo,
    project,
    requirements,
    deadline,
    missionType,
    description,
    Privetproject,
    ArchievStatuts
   
  } = req.body;

  try {
    console.log("Updating mission:", id, status);

    // Update the mission
    const updatedMission = await missionSchema.findByIdAndUpdate(
      id,
      {
        title,
        status,
        assignedTo,
        project,
        requirements,
        deadline,
        missionType,
        description,
        Privetproject,
        ArchievStatuts
       
      },
      { new: true }
    );

    if (!updatedMission) {
      return res.status(404).json({ message: "Mission not found" });
    }
 
 
     
    // Update the chat participants if assigned users changed
    const chat = await chatSchema.findOne({ missionID: id });

    if (chat && assignedTo) {
      chat.participants = assignedTo; // Update chat participants
      await chat.save();
    }

    // Populate mission details
    const populatedMission = await missionSchema
      .findById(id)
      .populate({ path: "assignedTo", select: "fullName email" })
      .populate({ path: "project", select: "projectName" })
      .populate({ path: "assignedBy", select: "fullName email" })
      .populate({ path: "Privetproject", select: "projectName" })
      .lean();

    // Send email notifications asynchronously
    setImmediate(() => sendMissionUpdateEmails(populatedMission));

    res.status(200).json({ message: "Mission updated successfully", updatedMission });
  const notifications = assignedTo.map((admin) => ({
      user: admin,  // Ensure this is a number if required
      employee: req.token?.id,
      levels: "missions",
      type: "update",
      allowed:updatedMission?._id,
      message:"تم تعديل المهمة الخاصة بك",
    }));

    // ✅ Save notifications
    await notificationSchema.insertMany(notifications);
  } catch (error) {
    console.error("Error updating mission:", error);
    next(error);
  }
};

// Function to send mission update emails
const sendMissionUpdateEmails = async (mission) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });

    for (const user of mission.assignedTo) {
      if (!user.email) continue; // Skip users without an email

      const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: user.email,
        subject: "🔔 تحديث المهمة الموكلة إليك",
        html: `
          <div style="text-align: center; direction: rtl; font-family: Arial, sans-serif;">
            <img src="cid:logo" style="width: 100%; max-width: 600px;" alt="شعار الشركة">
            <h2 style="color: #333;">🔄 تم تحديث المهمة الموكلة إليك</h2>
            <p style="font-size: 18px; color: #555;">📌 <strong>عزيزي ${user.fullName},</strong></p>
            <p style="font-size: 16px; color: #555;">تم تعديل المهمة الخاصة بك، إليك التفاصيل الجديدة:</p>
            
            <table style="width: 100%; max-width: 600px; border-collapse: collapse; margin: 20px auto; font-size: 16px;">
            
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;">
                  <strong>📌 الحالة:</strong>
                </td>
                <td style="padding: 10px; border: 1px solid #ddd;">${mission.status}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;">
                  <strong>📅 الموعد النهائي:</strong>
                </td>
                <td style="padding: 10px; border: 1px solid #ddd;">${new Date(mission.deadline).toLocaleDateString("ar-EG")}</td>
              </tr>
          
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;">
                  <strong>🛠️ المحدّث:</strong>
                </td>
                <td style="padding: 10px; border: 1px solid #ddd;">${mission.assignedBy.fullName}</td>
              </tr>
            </table>

            <p style="font-size: 16px; color: #555;">💡 يرجى تسجيل الدخول إلى حسابك لمزيد من التفاصيل:</p>
            <a href="${process.env.CLIENT_URL}" style="display: inline-block; padding: 12px 20px; background-color: #218bc7; color: white; text-decoration: none; border-radius: 5px; font-size: 18px;">
              📂 الذهاب إلى لوحة التحكم
            </a>
          </div>
        `,
           attachments: [
              {
                filename: "logo2.png",
                path: logo, // تأكد من أن مسار الصورة صحيح
                cid: "logo",
                 contentType: "image/png"
              },
            ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Error sending email to ${user.email}:`, error);
        } else {
          console.log(`Email sent to ${user.email}:`, info.response);
        }
      });
    }
  } catch (error) {
    console.error("Error sending mission update emails:", error);
  }
};


module.exports = updateMission;
