const mongoose = require("mongoose");
const firstpayment = mongoose.Schema(
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
module.exports = mongoose.model("firstpayment" , firstpayment)
