const missionSchema = require("../../model/missionSchema");
const nodemailer = require("nodemailer");
const addMission = async (req, res, next) => {
  const {
    title,
    status,
    assignedTo,
    project,
    deadline,
    missionType,
    description,
    Privetproject
  } = req.body;
  try {
    const newMission = await missionSchema.create({
      title,
      status,
      assignedTo,
      project,
      assignedBy: req.token.id,
      deadline,
      missionType,
      description,
      Privetproject
    });
    const populatemission = await missionSchema.findById(newMission._id)
    .populate({
        path: "assignedTo",
        select: "fullName email"
    })
    .populate({
        path: "project",
        select: "projectName"
    })
    .populate({
        path: "assignedBy",
        select: "fullName"
    })
    .populate({
        path: "Privetproject",
        select: "projectName"
    })
    .lean();        // Send the email in a background task using setImmediate
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
            to: populatemission.assignedTo.email,
            subject: "New Mission",
            html: `
                <p>Dear ${populatemission.assignedTo.fullName},</p>
                <p>You have received a New Mission</p>
                <p>Added before: ${populatemission.assignedBy.fullName}</p>
                <p>Subject: ${populatemission.project ? populatemission.project.projectName : populatemission.Privetproject.projectName}</p>
                <p>Make sure to open Your Account And Check it</p>
                <a href=${process.env.CLIENT_URL} style="display: inline-block; padding: 10px 20px; background-color: #218bc7; color: white; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
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
    res
      .status(201)
      .json({ message: "mession created successfully", newMission });
  } catch (error) {
    next(error);
  }
};
module.exports = addMission;
