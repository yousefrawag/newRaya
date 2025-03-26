const currencySchema = require("../../model/currency")
const updateCurrency = async (req , res) =>{
    const {id} = req.params
    const {name} = req.body
    const updateNew = await currencySchema.findByIdAndUpdate(id , {
        name
    } , {new:true})
    res.status(200).json({mesg:"currency updated " , updateNew});
}
module.exports = updateCurrency