const invoiceSchema = require("../../model/anviocsesschema")
const DeleteInvoices = async (req , res) => {
    const {id} = req.params
    try {
        await invoiceSchema.findByIdAndDelete(id)
        res.json({mesg:"invoces deleted successfully"})
    } catch (error) {
        res.send(error)
    }    
}
module.exports = DeleteInvoices