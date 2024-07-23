const mongoose = require('mongoose')
const client = mongoose.Schema({
    image:{
        type:String,
        default:"https://ps.w.org/user-avatar-reloaded/assets/icon-128x128.png?rev=2540745"

    },
    name:{
        type:String,
        unique:true
        
    },
    email:{
        type:String
    },
    governorate:{
        type:String
    },
    phonNumber:{
        type:String
    },
    phonenumber2:{
        type:String
    },
    title:{
        type:String
    },
    cardnumber:{
        type:String
    }
} , {
    timestamps: true
})
const clientSchema = mongoose.model("client"  ,  client)
module.exports = clientSchema