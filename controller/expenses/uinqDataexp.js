const expensesSchema = require("../../model/expensesSchema");
const uinqDataexp = async (req, res, next) => {
  try {
  
    const expenses = await expensesSchema
      .find({})
      .populate("user")
      .populate("adedBy");
      const user = [...new Set(expenses.map((item) => item.user))]
      const adedBy = [...new Set(expenses.map((item) => item.adedBy))]

     
    res.status(200).json({user  ,  adedBy });
  } catch (error) {
    next(error);
  }
};
module.exports = uinqDataexp;
