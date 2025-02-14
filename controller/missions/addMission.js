const missionSchema = require("../../model/missionSchema");
const chatSchema = require("../../model/chatSchema");
const userSchema = require("../../model/userSchema");
const nodemailer = require("nodemailer");
const path = require("path");
const logo = path.join(__dirname, "../../images/logo2.jpg");
const sectionSchema = require("../../model/Sections")
const addMission = async (req, res, next) => {
  try {
    const {
      title,
      status,
      assignedTo,
      project,
      deadline,
      missionType,
      description,
      Privetproject,
      section
    } = req.body;

    // Create a new mission
    const newMission = await missionSchema.create({
      title,
      status,
      assignedTo,
      project,
      assignedBy: req.token.id,
      deadline,
      section ,
      
      missionType,
      description,
      Privetproject,
    });

    // Create a chat for the mission
    const newChat = await chatSchema.create({
      missionID: newMission._id, 
      participants: assignedTo, 
    });
    const CurrenSection = await sectionSchema.findById(section)
    if(!CurrenSection) return res.status(403).json("not found")
      newMission.requirements = CurrenSection.Features
    // Link the chat ID to the mission
    newMission.chatID = newChat._id;
    await newMission.save();

    // Populate necessary mission details
    const populatedMission = await missionSchema
      .findById(newMission._id)
      .populate({ path: "assignedTo", select: "name email" })
      .populate({ path: "project", select: "projectName" })
      .populate({ path: "assignedBy", select: "name email" })
      .populate({ path: "Privetproject", select: "projectName" })
      .lean();

    // Send email notifications asynchronously
    setImmediate(() => sendMissionEmails(populatedMission));

    res.status(201).json({
      message: "Mission created successfully",
      data: newMission,
    });

  } catch (error) {
    console.error("Error adding mission:", error);
    next(error);
  }
};

// Function to send emails to assigned users
const sendMissionEmails = async (mission) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });

    for (const user of mission.assignedTo) {
      if (!user.email) continue; // تخطي المستخدمين الذين لا يملكون بريدًا إلكترونيًا

      const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: user.email,
        subject: "📌 مهمة جديدة تم تعيينها لك",
        html: `
          <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
            <!-- شعار الشركة -->
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="cid:logo" alt="شعار الشركة" style="width: 100%; max-width: 600px; border-radius: 10px;">
            </div>

            <!-- محتوى البريد -->
            <h2 style="color: #218bc7;">🔔 لديك مهمة جديدة!</h2>
            <p style="font-size: 18px; color: #333;">مرحبًا <b>${user.name}</b>,</p>
            <p style="font-size: 16px;">تم تعيين مهمة جديدة لك بواسطة <b>${mission.assignedBy.name}</b>.</p>
            <p><strong>📌 عنوان المهمة:</strong> ${mission.title}</p>
            <p><strong>📅 تاريخ التسليم:</strong> ${new Date(mission.deadline).toLocaleDateString("ar-EG")}</p>

            <p style="margin-top: 10px; font-size: 14px; color: #555;">
              يُرجى تسجيل الدخول إلى حسابك لمراجعة تفاصيل المهمة والبدء في تنفيذها.
            </p>

            <!-- زر الدخول إلى المنصة -->
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.CLIENT_URL}" 
                style="display: inline-block; padding: 12px 24px; background-color: #218bc7; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">
                🎯 الذهاب إلى المنصة
              </a>
            </div>

            <p style="margin-top: 20px; font-size: 12px; color: #888;">📌 هذا البريد مرسل تلقائيًا، لا ترد عليه.</p>
          </div>
        `,
        attachments: [
          {
            filename: "logo2.jpg",
            path: logo, // تأكد من أن مسار الصورة صحيح
            cid: "logo",
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`❌ خطأ أثناء إرسال البريد إلى ${user.email}:`, error);
        } else {
          console.log(`✅ تم إرسال البريد بنجاح إلى ${user.email}:`, info.response);
        }
      });
    }
  } catch (error) {
    console.error("❌ خطأ أثناء إرسال البريد الإلكتروني:", error);
  }
};


module.exports = addMission;
