const clientMeetingSchema = require("../../model/CustomerMeeting");
const getAllMeeting = async (req, res, next) => {
  try {
    const {project , client , addedBy} = req.query
    let fillters = {}
    if(project) {
      fillters = {...fillters, project}
    }
    if(client){
      fillters = {...fillters, client}
    }
    if(addedBy){
      fillters = {...fillters, addedBy}
    }
    const meetings = await clientMeetingSchema.find(fillters).populate("addedBy").populate("project").populate("client");
    res.status(200).json({ meetings });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllMeeting;
