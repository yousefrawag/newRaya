const mongoose = require("mongoose");
const file = mongoose.Schema(
  {
    imageURL:String, 
    imageID:String
  },
  { _id: false }
);
const visaSchema = mongoose.Schema(
    {
        title:{
            type:String,
            unique: true,
            required: true
        },
     
        Features:[
            {
                title:String,
                details:String
            }
        ],
        image:file,
        flag:file
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("visa" , visaSchema)
