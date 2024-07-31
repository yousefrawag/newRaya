const expensesSchema = require("../../model/expensesSchema");
const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await expensesSchema.find({});
    res.status(200).json({ expenses });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllExpenses;
