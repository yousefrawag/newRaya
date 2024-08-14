const meetingSchema = require("../../model/MeetingSchema");
const updateMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, meetingDate, meetingDetails, meetingResult } = req.body;
    const update = await meetingSchema.findByIdAndUpdate(
      id,
      {
        title,
        meetingDate,
        meetingDetails,
        meetingResult,
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
