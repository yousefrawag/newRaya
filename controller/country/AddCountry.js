const countrySchema = require("../../model/countrySchema")
const AddCountry = async (req , res) => {
  const {countryName , locations} = req.body
  const newCountry = await countrySchema.create({
    countryName,
    locations
  }) 
  res.status(200).json({mesg:"country add" , newCountry})
}
module.exports = AddCountry