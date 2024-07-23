const mongoose = require('mongoose')
const invoices = mongoose.Schema({
    clientNmae:{
        type:String,
        required:true,
    },
    projectName:{
        type:String,
        required:true,
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"client"
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    EstateType:{
        type:String,
        required:true
    },
    dueDate:{
        type:Date
    },
    invoicsStatus:{
        type:String,
    },
    invoicesTotal :{
        type:String
    },
} , {
    timestamps: true
})
const invoiceSchema = mongoose.model('invoice' , invoices)
module.exports = invoiceSchema