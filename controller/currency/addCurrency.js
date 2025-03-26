const currencySchema = require("../../model/currency")
const Addcurrency = async (req , res) => {
    const {name} = req.body
    if(name){
        const addnew = await currencySchema.create({name})
       return res.status(200).json({mesg:"currency add sucuufuly"});
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
module.exports = Addcurrency