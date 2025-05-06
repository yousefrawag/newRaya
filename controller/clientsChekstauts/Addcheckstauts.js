const ClientCheckstautsSchema = require("../../model/ClientCheckstauts")
const Addcheckstauts = async (req , res) => {
    const {name} = req.body
    if(name){
        const addnew = await ClientCheckstautsSchema.create({name})
       return res.status(200).json({mesg:"currency add sucuufuly"});
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
module.exports = Addcheckstauts