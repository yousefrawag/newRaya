const mongoose = require("mongoose");
const ClientRequiremntSchema = mongoose.Schema(
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
module.exports = mongoose.model("clientRequirements" , ClientRequiremntSchema)
