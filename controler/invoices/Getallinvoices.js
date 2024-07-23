const invoiceSchema = require("../../model/anviocsesschema")
const Getallinvoices = async (req , res) => {
try {
    const allInvoices  =await invoiceSchema.find({})
    res.json({allInvoices})
} catch (error) {
    res.send(error)
}
}
module.exports = Getallinvoices