const invoiceSchema = require("../../model/anviocsesschema")
const projectSchema = require('../../model/projectSchema')

const Addinvoics = async (req , res) => {
const {clientNmae , projectName , client , project , EstateType , dueDate , invoicsStatus , invoicesTotal} = req.body
// const findeProject = await projectSchema.find(projectName)
// res.send(findeProject) 
        try {
            // const findClient = await clientSchema.find({name: clientNmae}) // get client id info
            const newinvoices = await invoiceSchema.create({
                clientNmae,
                projectName,
                EstateType,
                dueDate,
                invoicsStatus,
                invoicesTotal,
                client,
                project

            })
            res.json({newinvoices})
        } catch (error) {
            res.send(error)
        }
}
module.exports = Addinvoics