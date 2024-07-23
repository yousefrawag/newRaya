const expensesSchema = require('../../model/expensesSchema')
const AddExpenses = async (req  ,res) => {
    const {expensesName  , projectName , EstateType , expensesTotal , details} = req.body
    try {
     
        const addexpenses = await expensesSchema.create({
            expensesName,
            projectName,
            EstateType,
            expensesTotal,
            details

        })
        res.json({addexpenses})
    } catch (error) {
        throw new Error(error)
    }
}
module.exports = AddExpenses