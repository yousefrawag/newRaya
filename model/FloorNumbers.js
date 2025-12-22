const mongoose = require("mongoose");
const FloorNumber = mongoose.Schema(
    {
        name:{
            type:Number,
            unique: true,
            required: true
        }
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("FloorNumber" , FloorNumber)
