const meetingSchema = require('../../model/MeetingSchema')
const Getallmeeting = async (req , res) => {
    try {
        const meetings = await meetingSchema.find({})
        res.json({meetings})
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = Getallmeeting