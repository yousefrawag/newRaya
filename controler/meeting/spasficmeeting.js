const meetingSchema = require('../../model/MeetingSchema')
const spasficmeeting  = async (req , res) =>{
    try {
        const {id} = req.params
        const currentmeeting = await meetingSchema.findById(id).populate("addingBy")
        if(currentmeeting){
            return res.json({currentmeeting})
        }else{
            res.json({mesg:"this meeting not found in db"})
        }
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = spasficmeeting