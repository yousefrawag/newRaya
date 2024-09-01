const clientMeetingSchema = require("../../model/CustomerMeeting");
const addMeeting = async (req, res, next) => {
    const { title, meetingDate, meetingDetails, project, client, phoneNumber } = req.body;

  try {
    const newMeeting = await clientMeetingSchema.create({
      title,
      meetingDate,
      meetingDetails,
      project,
      client,
      phoneNumber,
      addedBy: req.token.id,
    });
    res
      .status(201)
      .json({ message: "meeting created successfully", newMeeting });
  } catch (error) {
    throw new Error(error)
    next(error);
  }
};
module.exports = addMeeting;