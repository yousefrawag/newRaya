const expensesSchema = require('../../model/expensesSchema')
const Deleteexpenses = async (req , res) => {
    
    try {
        const {id} = req.params
        await expensesSchema.findByIdAndDelete(id)
        res.json({mesg:"expenses deleted successfully"})
    } catch (error) {
        res.send(error)
    }  
}
module.exports = Deleteexpenses