const mongoose = require("mongoose");
const InstitutionsCompany = mongoose.Schema(
    {    name:{
            type:String,
            unique: true,
            required: true
        } ,
        status:{
            type:String,
        
            required: true ,
            default:"active"
        }
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("InstitutionsCompany" , InstitutionsCompany)
