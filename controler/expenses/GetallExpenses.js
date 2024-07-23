const expensesSchema = require('../../model/expensesSchema')
const GetallExpenses = async (req , res) => {
    try {
        const allexpenses  = await expensesSchema.find({})
        res.json({allexpenses})
    } catch (error) {
        throw new Error(error)
    }
}
module.exports = GetallExpenses