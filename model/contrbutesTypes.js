const mongoose = require("mongoose");
const cuntrbuteSchema = mongoose.Schema(
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
module.exports = mongoose.model("cuntrbuteSchema" , cuntrbuteSchema)
