const currencySchema = require("../../model/currency")
const getAllCurrency = async (req , res) => {
    const allCurrency = await currencySchema.find({}).sort({ createdAt: -1 })
    res.status(200).json({data:allCurrency})
}
module.exports = getAllCurrency