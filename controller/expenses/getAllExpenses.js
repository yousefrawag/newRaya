const expensesSchema = require("../../model/expensesSchema");
const userSchema =require("../../model/userSchema")
const getAllExpenses = async (req, res, next) => {
  try {
    const {field , searTerm  } = req.query
    let fillters = {}
if (["expenseName" , "projectName" , "expenseTotal" , "details"].includes(field) && searTerm){
fillters[field] = { $regex: new RegExp(searTerm, 'i') }
}
if(["user" , "adedBy"].includes(field) && searTerm){
const foundUser = await userSchema.find({fullName:{ $regex: new RegExp(searTerm, 'i') }})
if(foundUser && foundUser.length){
  fillters[field] = foundUser[0]?._id
}
}
    const expenses = await expensesSchema.find(fillters).populate("user").populate("adedBy").sort({ createdAt: -1 });
    res.status(200).json({ expenses });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllExpenses;
