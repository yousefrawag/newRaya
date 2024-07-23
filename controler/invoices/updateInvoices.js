const invoiceSchema = require("../../model/anviocsesschema")
const updateInvoices = async (req ,res  ) => {
    const {id} = req.params
    const {clientNmae , projectName , client , project , EstateType , dueDate , invoicsStatus , invoicesTotal} = req.body
    try {
        const new_update = await invoiceSchema.findByIdAndUpdate(id , {
            clientNmae,
            projectName,
            EstateType,
            dueDate,
            invoicsStatus,
            invoicesTotal,
            client,
            project
        } , {new:true})
        if(new_update){
            res.json({new_update})
        }else{
            res.json({mesg:"thsi inovces not found in db"})
        }
    } catch (error) {
        res.send(error)
    }

}
module.exports = updateInvoices