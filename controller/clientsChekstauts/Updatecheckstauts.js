const ClientCheckstautsSchema = require("../../model/ClientCheckstauts")
const Updatecheckstauts = async (req , res) =>{
    const {id} = req.params
    const {name} = req.body
    const updateNew = await ClientCheckstautsSchema.findByIdAndUpdate(id , {
        name
    } , {new:true})
    res.status(200).json({mesg:"currency updated " , updateNew});
}
module.exports = Updatecheckstauts