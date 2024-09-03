const clientMeetingSchema = require("../../model/CustomerMeeting");
const uinqDataMeeting = async (req, res, next) => {
  try {
  
    const meeting = await clientMeetingSchema
      .find({})
      .populate("project")
      .populate("addedBy")
      .populate("client");
      const project = [...new Set(meeting.map((item) => item.project))]
      const client = [...new Set(meeting.map((item) => item.client))]
      const addedBy = [...new Set(meeting.map((item) => item.addedBy))]

     
    res.status(200).json({project  ,  client ,  addedBy });
  } catch (error) {
    next(error);
  }
};
module.exports = uinqDataMeeting;
