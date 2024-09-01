const clientMeetingSchema = require("../../model/CustomerMeeting");
const getMeetingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const meeting = await clientMeetingSchema.findById(id).populate("addedBy").populate("client").populate("project");
    if (!meeting) {
      res.status(404).json({ message: "this meeting doesn't exist" });
    }
    res.status(200).json({ meeting });
  } catch (error) {
    next(error)
  }
};
module.exports = getMeetingById;
