const CustomerCallcenter = require("../../model/CustomerCallcenter")

const Deleate = async (req , res) => {
    const {id} = req.params
    const currentcurrency = await CustomerCallcenter.findById(id)
    if(currentcurrency) {
        await CustomerCallcenter.findByIdAndDelete(id)
      return  res.status(200).json({mesg:"clientsuts deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
module.exports = Deleate