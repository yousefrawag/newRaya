const ExpensessSchema = require("../../model/Expensess")

const DeleteExpenses = async (req , res) => {
    const {id} = req.params
    const currentExpensess = await ExpensessSchema.findById(id)
    if(currentExpensess) {
        await ExpensessSchema.findByIdAndDelete(id)
      return  res.status(200).json({mesg:"currency deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
module.exports = DeleteExpenses