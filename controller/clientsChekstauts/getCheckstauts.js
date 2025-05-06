const ClientCheckstautsSchema = require("../../model/ClientCheckstauts")
const getCheckstauts = async (req , res) => {
    const allCurrency = await ClientCheckstautsSchema.find({}).sort({ createdAt: -1 })
    res.status(200).json({data:allCurrency})
}
module.exports = getCheckstauts