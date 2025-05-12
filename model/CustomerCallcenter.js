const mongoose = require("mongoose");
const ClientcallstuatsSchema = mongoose.Schema(
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
module.exports = mongoose.model("customerCallstauts" , ClientcallstuatsSchema)
