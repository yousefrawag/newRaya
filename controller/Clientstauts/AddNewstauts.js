const ClientstuatsSchema = require("../../model/Clientstuats")
const AddNewstauts = async (req , res) => {
    const {name} = req.body
    if(name){
        const addnew = await ClientstuatsSchema.create({name})
       return res.status(200).json({mesg:"currency add sucuufuly"});
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
module.exports = AddNewstauts