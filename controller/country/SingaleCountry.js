const countrySchema = require("../../model/countrySchema")
const SingaleCountry = async (req , res) => {
    const {id} = req.params
    console.log(id);
    
    try {
       
 
        const currentCountry = await countrySchema.findById(id)
        if(currentCountry) {
        
         return   res.status(200).json({mesg:"get singale country " , currentCountry})
        }        
    } catch (error) {
        throw new Error(error)
    }


}
module.exports = SingaleCountry