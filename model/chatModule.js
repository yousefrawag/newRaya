const mongoose = require('mongoose')
const cahtSchema = mongoose.Schema({
    chatName:{type:String , required:true , trim:true},
    isGroupChat:{type:Boolean , required:true , default:false},
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
    groupAdmin:{
          type:mongoose.Schema.Types.ObjectId,
            ref:"user"
    }
}, {
    timestamps:true
})
const chat = mongoose.model('chat' , cahtSchema)
module.exports = chat
