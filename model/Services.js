const mongoose = require("mongoose");
const file = mongoose.Schema(
  {
    imageURL:String, 
    imageID:String
  },
  { _id: false }
);
const ServicesSchema = mongoose.Schema(
    {
        title:{
            type:String,
            unique: true,
            required: true
        },
        desc:{
            type:String,
            
            required: true
        },
        Features:[
    
        ],
        image:file
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("services" , ServicesSchema)
