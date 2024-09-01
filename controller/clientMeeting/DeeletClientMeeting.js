const clientMeetingSchema = require("../../model/CustomerMeeting");
const deleteMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    await clientMeetingSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "meeting deleted  successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = deleteMeeting;
