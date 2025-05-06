const ClientstuatsSchema = require("../../model/Clientstuats")
const Getallclientstauts = async (req , res) => {
    const allCurrency = await ClientstuatsSchema.find({}).sort({ createdAt: -1 })
    res.status(200).json({data:allCurrency})
}
module.exports = Getallclientstauts