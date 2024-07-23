const mongoose = require('mongoose')
const cahtModule = mongoose.Schema({
    sender:   {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
content:{type:String , trim:true},
chat:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"chat"
},
}, {
    timestamps:true
})
const chat = mongoose.model('message' , cahtModule)
module.exports = chat