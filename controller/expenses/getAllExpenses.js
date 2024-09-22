const expensesSchema = require("../../model/expensesSchema");
const getAllExpenses = async (req, res, next) => {
  try {
    const {user , adedBy } = req.query
    let fillters = {}
    if(user){
      fillters = {...fillters, user}
    }
    if(adedBy) {
      fillters = {...fillters,adedBy}
    }
    const expenses = await expensesSchema.find(fillters).populate("user").populate("adedBy").sort({ createdAt: -1 });
    res.status(200).json({ expenses });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllExpenses;
