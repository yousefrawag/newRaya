const expensesSchema = require('../../model/expensesSchema')
const updateexpenses = async (req , res) => {
    const {id} = req.params
    const {expensesName  , projectName , EstateType , expensesTotal , details}= req.body
    try {
        const new_update = await expensesSchema.findByIdAndUpdate(id , {
            expensesName,
            projectName,
            EstateType,
            expensesTotal,
            details
        } , {new:true})
        if(new_update){
            res.json({new_update})
        }else{
            res.json({mesg:"thsi expenses not found in db"})
        }
    } catch (error) {
        res.send(error)
    }
}
module.exports = updateexpenses