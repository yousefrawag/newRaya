const mongoose = require("mongoose");
const ClientcheckstuatsSchema = mongoose.Schema(
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
module.exports = mongoose.model("clientcheckstauts" , ClientcheckstuatsSchema)
