const mongoose = require('mongoose')
const expenses = mongoose.Schema({
    expensesName:{
        type:String,
        required:true,
    },
    projectName:{
        type:String,
        required:true,
    },
    EstateType:{
        type:String,
        required:true
    },
    expensesTotal :{
        type:String
    },
    details:{
        type:String
    }
} , {
    timestamps: true
})
const expensesSchema = mongoose.model('expenses' , expenses)
module.exports = expensesSchema