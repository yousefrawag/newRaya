const expensesSchema = require("../../model/expensesSchema");
const updateExpense = async (req, res, next) => {
  const { id } = req.params;
  const { expenseName, projectName, EstateType, expenseTotal, details } =
    req.body;
  try {
    const new_update = await expensesSchema.findByIdAndUpdate(
      id,
      {
        expenseName,
        projectName,
        EstateType,
        expenseTotal,
        details,
      },
      { new: true }
    );
    if (!new_update) {
      res.status(404).json({ message: "Expense doesn't exist" });
    }
    res
      .status(200)
      .json({ message: "Expense updated successfully", new_update });
  } catch (error) {
    next(error);
  }
};
module.exports = updateExpense;
