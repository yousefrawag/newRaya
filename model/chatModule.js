const mongoose = require('mongoose')
const cahtSchema = mongoose.Schema({
    chatName:{type:String , required:true , trim:true},
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    latestMassage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"message"
    },
  
}, {
    timestamps:true
})
const chat = mongoose.model('chat' , cahtSchema)
module.exports = chat
