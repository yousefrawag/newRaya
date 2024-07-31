const expensesSchema = require("../../model/expensesSchema");
const addExpense = async (req, res, next) => {
  const { expenseName, projectName, EstateType, expenseTotal, details } =
    req.body;
  try {
    const expense = await expensesSchema.create({
      expenseName,
      projectName,
      EstateType,
      expenseTotal,
      details,
    });
    res.status(201).json({ message: "expense created successfully", expense });
  } catch (error) {
    next(error);
  }
};
module.exports = addExpense;
