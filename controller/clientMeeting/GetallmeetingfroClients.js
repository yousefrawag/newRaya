const clientMeetingSchema = require("../../model/CustomerMeeting");
const getAllMeeting = async (req, res, next) => {
  try {
    const meetings = await clientMeetingSchema.find({}).populate("addedBy").populate("project").populate("client");
    res.status(200).json({ meetings });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllMeeting;
