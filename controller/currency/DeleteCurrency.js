const currencySchema = require("../../model/currency")

const DeleteCurrency = async (req , res) => {
    const {id} = req.params
    const currentcurrency = await currencySchema.findById(id)
    if(currentcurrency) {
        await currencySchema.findByIdAndDelete(id)
        res.status(200).json({mesg:"currency deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
module.exports = DeleteCurrency