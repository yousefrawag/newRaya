const mongoose = require("mongoose");
const projectlocation = mongoose.Schema(
    {
        name:{
            type:String,
            unique: true,
            required: true ,
            trim:true
        } ,
          relatedRegions:{
            type:[String]
        }
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("projectlocation" , projectlocation)
