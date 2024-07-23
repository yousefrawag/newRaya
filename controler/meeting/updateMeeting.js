const meetingSchema = require('../../model/MeetingSchema')
const updateMeeting = async (req , res) => {
   try {
    const {id} = req.params
    const {Title , meetingDate , meetingDetails , addingBy  , meetingResult} = req.body
    const update = await meetingSchema.findByIdAndUpdate(id  ,{
            Title , 
            meetingDate,
            meetingDetails,
            addingBy,
            meetingResult
    } , {new:true})
    res.json({update})
   } catch (error) {
    res.send(error.message)
   }
   

}
module.exports = updateMeeting