const mongoose = require("mongoose");
const LinksSchema = mongoose.Schema(
    {    name:{
            type:String,
        
            required: true
        } ,
        url:{
            type:String,
            unique: true,
            required: true
        }
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("LinksSchema" , LinksSchema)
