const mongoose = require("mongoose");
const ClientstuatsSchema = mongoose.Schema(
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
module.exports = mongoose.model("clientstauts" , ClientstuatsSchema)
