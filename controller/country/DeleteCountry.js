const countrySchema = require("../../model/countrySchema")
const DeleteCountry = async (req , res) => {
    const {id} = req.params
 
  const currentCountry = countrySchema.findById(id)
  if(currentCountry) {
    await countrySchema.findByIdAndDelete(id) 
    return  res.status(200).json({mesg:"country delted "})
  }

}
module.exports = DeleteCountry