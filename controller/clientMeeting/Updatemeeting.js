const clientMeetingSchema = require("../../model/CustomerMeeting");
const updateMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, meetingDate, meetingDetails, project, client, phoneNumber , meetingResult} = req.body;
    const update = await clientMeetingSchema.findByIdAndUpdate(
      id,
      {
        title,
        meetingDate,
        meetingDetails,
        meetingResult,
        project, client, phoneNumber,
        addedBy: req.token.id,
      },
      { new: true }
    );
    res.json({ message: "meeting updated successfully", update });
  } catch (error) {
    next(error);
  }
};
module.exports = updateMeeting;
