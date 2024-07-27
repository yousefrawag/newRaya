const mongoose = require('mongoose')
const Meeting = mongoose.Schema({
    Title:{
        type:String,
        required:true,
    },
    meetingDate:{
        type:Date
    },
    meetingDetails:{
        type:String
    },
    meetingResult:{
        type:String
    },
    addingBy:{
           type:mongoose.Schema.Types.ObjectId,
            ref:"user"
    }
} , {
    timestamps:true
})
const meetingSchema = mongoose.model("meeting" , Meeting)
module.exports = meetingSchema