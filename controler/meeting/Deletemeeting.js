const meetingSchema = require('../../model/MeetingSchema')
const Deletemeeting  = async (req , res) => {
    try {
        const {id} = req.params
        await meetingSchema.findByIdAndDelete(id)
        res.json({mesg:"delete meeting successfully"})
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = Deletemeeting