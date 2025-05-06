const ClientCheckstautsSchema = require("../../model/ClientCheckstauts")

const Deletecheckstauts = async (req , res) => {
    const {id} = req.params
    const currentcurrency = await ClientCheckstautsSchema.findById(id)
    if(currentcurrency) {
        await currencySchema.findByIdAndDelete(id)
      return  res.status(200).json({mesg:"clientsuts deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
module.exports = Deletecheckstauts