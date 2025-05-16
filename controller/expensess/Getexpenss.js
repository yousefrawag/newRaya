const ExpensessSchema = require("../../model/Expensess")
const Getexpenss = async (req , res) => {
    const allExpensess = await ExpensessSchema.find({}).sort({ createdAt: -1 }).populate("user")
    res.status(200).json({data:allExpensess})
}
module.exports = Getexpenss