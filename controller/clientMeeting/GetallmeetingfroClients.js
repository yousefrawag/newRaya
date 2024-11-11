const clientMeetingSchema = require("../../model/CustomerMeeting");
const userschema = require("../../model/userSchema")
const getAllMeeting = async (req, res, next) => {
  try {
    const {field , searTerm , startDate , endDate } = req.query
    let fillters = {}
    if(["project" , "title" , "client" , "meetingDetails" , "meetingResult" , "phoneNumber"].includes(field) && searTerm) {
      fillters[field] = { $regex: new RegExp(searTerm, 'i') }
    }
if(["meetingDate" , "createdAt"].includes(field) && endDate){
  fillters[field] = {
    $gte: new Date(startDate),  // greater than or equal to fromDate
    $lte: new Date(endDate) 
  }
}
if(field === "addedBy" && searTerm){
const foundeUser  = await userschema.find({fullName:{ $regex: new RegExp(searTerm, 'i') }})
if (foundeUser && foundeUser.length ){
  fillters[field] = foundeUser[0]._id
}
}
    const meetings = await clientMeetingSchema.find(fillters).populate("addedBy").sort({ createdAt: -1 });
    res.status(200).json({ meetings });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllMeeting;
