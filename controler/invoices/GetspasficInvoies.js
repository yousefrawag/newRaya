const invoiceSchema = require("../../model/anviocsesschema")
const GetspasficInvoies = async (req ,res) =>{
    const {id} = req.params
    try {
        const currentInvoices = await invoiceSchema.findById(id).populate("client").populate("project")
        if(currentInvoices){
            return res.json({currentInvoices})
        }else{
            res.json({mesg:"error this iteam not avlible in db"})
        }
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = GetspasficInvoies