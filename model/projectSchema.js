const mongoose = require('mongoose')
const project = mongoose.Schema({
    estateType:{
        type:String,
        required: [true, "Please add a name."]
    },
    governorate:{
        type:String,
        required: [true, "Please add a governote name."] 
    },
    city:{
        type:String,
        required: [true, "Please add a city name."] 
    },
    esateNumber:{
        type:String,
        required: [true, "Please add a esateNumber "] 
    },
    specificEstate:{
        type:String,
        required: [true, "Please add a specificEstate "] 
    },
    clientType:{
        type:String,
        required: [true, "Please add a clientType "] 
    },
    esatePrice:{
        type:Number,
        required: [true, "Please add a clientType "] 
    },
    opertaionType:{
        type:String,
        required: [true, "Please add a opertaionType "] 
    },
    installments:{
        type:String,
        required: [true, "Please add a installments "] 
    },
    installmentsForYear:{
        type:Number,
        required: [true, "Please add a installmentsForYear "] 
    },
    areeMater:{
        type:String,
        required: [true, "Please add a areeMater "] 
    },
    FinishingQuality:{
        type:String,
        required: [true, "Please add a FinishingQuality "] 
    },
    imagesVideos:[{type:String}],
    docs:[{type:String}],
    addingBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
    }
} , {
    timestamps: true
})
const Projectschema = mongoose.model("Project" , project)
module.exports = Projectschema