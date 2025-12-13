const mongoose = require("mongoose");
const monthPayment = mongoose.Schema(
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
module.exports = mongoose.model("monthPayment" , monthPayment)
