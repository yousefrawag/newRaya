const countrySchema = require("../../model/countrySchema")
const updateCountry = async (req , res) => {
    const {id} = req.params
  const {countryName , locations} = req.body
  const currentCountry = await countrySchema.findById(id)
  if(currentCountry) {
    const newCountryUpdate =await countrySchema.findByIdAndUpdate(id , {
        countryName,
        locations
      } , {new : true}) 
     return res.status(200).json({mesg:"country updated" , newCountryUpdate})
  }

}
module.exports = updateCountry