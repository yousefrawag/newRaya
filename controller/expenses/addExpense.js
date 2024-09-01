const expensesSchema = require("../../model/expensesSchema");
const addExpense = async (req, res, next) => {
  const { expenseName, projectName, user ,  expenseTotal, details } =
    req.body;
  try {
    const expense = await expensesSchema.create({
      expenseName,
      projectName,
      user,
      expenseTotal,
      details,
      adedBy:req.token.id
    });
    res.status(201).json({ message: "expense created successfully", expense });
  } catch (error) {
    next(error);
  }
};
module.exports = addExpense;
