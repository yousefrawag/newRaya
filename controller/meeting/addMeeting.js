const meetingSchema = require("../../model/meetingSchema");
const addMeeting = async (req, res, next) => {
  const { title, meetingDate, meetingDetails } = req.body;

  try {
    const newMeeting = await meetingSchema.create({
      title,
      meetingDate,
      meetingDetails,
      addedBy: req.token.id,
    });
    res
      .status(201)
      .json({ message: "meeting created successfully", newMeeting });
  } catch (error) {
    next(error);
  }
};
module.exports = addMeeting;
