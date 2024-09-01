const expensesSchema = require("../../model/expensesSchema");
const getuserExpenseByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await expensesSchema.find({user:id}).populate("user");
    if (!user) {
      res.status(404).json({ user });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
module.exports = getuserExpenseByID;
