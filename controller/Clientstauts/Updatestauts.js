const ClientstuatsSchema = require("../../model/Clientstuats")
const Updatestauts = async (req , res) =>{
    const {id} = req.params
    const {name} = req.body
    const updateNew = await ClientstuatsSchema.findByIdAndUpdate(id , {
        name
    } , {new:true})
    res.status(200).json({mesg:"currency updated " , updateNew});
}
module.exports = Updatestauts