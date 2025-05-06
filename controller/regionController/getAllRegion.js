const regionScgema= require("../../model/regionSchema")
const getAllRegion = async (req , res) => {
    const allregion = await regionScgema.find({}).sort({ createdAt: -1 })
    res.status(200).json({data:allregion})
}
module.exports = getAllRegion