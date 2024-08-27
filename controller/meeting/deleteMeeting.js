const meetingSchema = require("../../model/MeetingSchema");
const deleteMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    await meetingSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "meeting deleted  successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = deleteMeeting;
