const ExpensessSchema = require("../../model/Expensess");

const UserExpensess = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = currentDate.getFullYear();

    // Fetch all expenses for the user
    const allExpenses = await ExpensessSchema.find({ user: userId });

    // Calculate totals and monthly expenses by currency
    const currencyStats = allExpenses.reduce((acc, expense) => {
      const currency = expense.curenccy || 'دولار'; // Default to dollar
      if (!acc[currency]) {
        acc[currency] = { 
          total: 0, 
          monthly: 0,
          transactionCount: 0 
        };
      }
      
      acc[currency].total += expense.total;
      acc[currency].transactionCount++;

      // Check if expense is from current month/year
      const expenseDate = new Date(expense.createdAt);
      if (
        expenseDate.getMonth() + 1 === currentMonth && 
        expenseDate.getFullYear() === currentYear
      ) {
        acc[currency].monthly += expense.total;
      }

      return acc;
    }, {});

    // Format response for DataFans
    const result = Object.keys(currencyStats).map(currency => ({
      currency,
      total: currencyStats[currency].total,
      monthly: currencyStats[currency].monthly,
      transactionCount: currencyStats[currency].transactionCount
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = UserExpensess;