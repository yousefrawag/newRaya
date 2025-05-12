const CustomerCallcenter = require("../../model/CustomerCallcenter")
const Callcentercustomerstauts = async (req , res) => {
    const allCurrency = await CustomerCallcenter.find({}).sort({ createdAt: -1 })
    res.status(200).json({data:allCurrency})
}
module.exports = Callcentercustomerstauts