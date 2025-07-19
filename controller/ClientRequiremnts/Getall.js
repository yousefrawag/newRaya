const ClientRequirementSchema = require("../../model/ClientRequirement")
const Getall = async (req , res) => {
    const allCurrency = await ClientRequirementSchema.find({})
    res.status(200).json({data:allCurrency})
}
module.exports = Getall