const meetingSchema = require("../../model/MeetingSchema");
const getMeetingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const meeting = await meetingSchema.findById(id).populate("addedBy");
    if (!meeting) {
      res.status(404).json({ message: "this meeting doesn't exist" });
    }
    res.status(200).json({ meeting });
  } catch (error) {
    next(error)
  }
};
module.exports = getMeetingById;
