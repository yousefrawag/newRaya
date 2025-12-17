const ClientRequirementSchema = require("../../model/ClientRequirement")
const Getall = async (req , res) => {
    const allCurrency = await ClientRequirementSchema.find({}).sort({ createdAt: -1 })
    res.status(200).json({data:allCurrency})
}
module.exports = Getall