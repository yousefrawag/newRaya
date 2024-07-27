const mongoose = require('mongoose')
const mission = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    assignedTo:{
           type:mongoose.Schema.Types.ObjectId,
            ref:"user"
    },
    project:{
           type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
    },
    missionType:{
        type:String,
    },
    description:{
        type:String,
        required:true
    },
    missionComplate:{
        type:Boolean,
        default:false
    },
    inprosess:{
        type:Boolean,
        default:false
    },
    addingBy:{
             type:mongoose.Schema.Types.ObjectId,
            ref:"crm"
    }
} , {
    timestamps: true
})
const missionSchema = mongoose.model('mission' , mission)
module.exports = missionSchema