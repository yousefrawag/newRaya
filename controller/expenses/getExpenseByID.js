const expensesSchema = require("../../model/expensesSchema");
const getExpenseByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await expensesSchema.findById(id);
    if (!expense) {
     return res.status(404).json({ message: "Expense doesn't exist" });
    }
    res.status(200).json({ expense });
  } catch (error) {
    next(error);
  }
};
module.exports = getExpenseByID;
