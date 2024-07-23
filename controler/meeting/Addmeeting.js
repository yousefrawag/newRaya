const meetingSchema = require('../../model/MeetingSchema')
const Addmeeting = async(req  ,res) => {
    const {Title , meetingDate , meetingDetails   , meetingResult} = req.body
    try {
        const newMeeting =await meetingSchema.create({
            Title,
            meetingDate,
            meetingDetails,
            addingBy:req.user._id,
            meetingResult
        })
        res.json({newMeeting})
    } catch (error) {
        res.send(error.message)
    }
    
}
module.exports = Addmeeting