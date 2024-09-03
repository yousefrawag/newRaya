const meetingSchema = require("../../model/MeetingSchema");
const getAllMeeting = async (req, res, next) => {
  try {
 
    const meetings = await meetingSchema.find({}).populate("addedBy");
    res.status(200).json({ meetings });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllMeeting;
