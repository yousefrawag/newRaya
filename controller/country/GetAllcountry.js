const countrySchema = require("../../model/countrySchema")
const GetAllcountry = async (req , res) => {
    const allcountrLocations = await countrySchema.find({})
    res.status(200).json({allcountrLocations});
}
module.exports = GetAllcountry