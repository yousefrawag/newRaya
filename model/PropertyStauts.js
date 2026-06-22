const mongoose = require("mongoose");
const PropertyStauts = mongoose.Schema(
    {
        name:{
            type:String,
            unique: true,
            required: true
        }
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("PropertyStauts" , PropertyStauts)
