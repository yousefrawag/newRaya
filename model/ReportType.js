const mongoose = require("mongoose");
const reportType = mongoose.Schema(
    {
        name:{
            type:String,
            unique: true,
            required: true ,
            trim:true
        } ,
          relatedRegions:{
            type:[String]
        } ,
                 ArchievStatuts :{
      type:Boolean ,
      default:false
    } 
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("reportType" , reportType)
