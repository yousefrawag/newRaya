const expensesSchema = require("../../model/expensesSchema");
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    await expensesSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "expenses deleted successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = deleteExpense;
