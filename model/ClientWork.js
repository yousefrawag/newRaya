const mongoose = require("mongoose");
const WorkSchema = mongoose.Schema(
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
module.exports = mongoose.model("work" , WorkSchema)
