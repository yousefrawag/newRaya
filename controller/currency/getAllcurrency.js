const currencySchema = require("../../model/currency")
const getAllCurrency = async (req , res) => {
    const allCurrency = await currencySchema.find({})
    res.status(200).json({allCurrency})
}
module.exports = getAllCurrency