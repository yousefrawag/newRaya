const mongoose = require("mongoose");
const file = mongoose.Schema(
  {
    imageURL:String, 
    imageID:String
  },
  { _id: false }
);
const sectioSchema = mongoose.Schema(
    {
        name:{
            type:String,
         
            required: true
        },
     
        Features:[
            {
                type:{type:String},
                complated:{type:Boolean , default:false},
                userEdit:{
                  type: Number,
                  ref: "users",
                }
              }
        ],
    
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("section" , sectioSchema)
