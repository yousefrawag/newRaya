const expensesSchema = require('../../model/expensesSchema')
const spasficExpenses = async (req , res) => {

    try {
        const {id} = req.params
        const currentexpenses = await expensesSchema.findById(id)
        if(currentexpenses){
            return res.json({currentexpenses})
        }else{
            res.json({mesg:"error this iteam not avlible in db"})
        }
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = spasficExpenses