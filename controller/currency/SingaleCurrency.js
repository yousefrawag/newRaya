const currencySchema = require("../../model/currency")

const SinagleCurrency = async (req , res) => {
    const {id} = req.params
    console.log(id);
    
    try {
       
 
        const currency = await currencySchema.findById(id)
        if(currency) {
        
            res.status(200).json({mesg:"get singale currency " , currency})
        }        
    } catch (error) {
        throw new Error(error)
    }


}
module.exports = SinagleCurrency