const regionScgema= require("../../model/regionSchema")
const GetallRegionArchiev = async (req , res) => {
    const allregion = await regionScgema.find({ArchievStatuts:true}).sort({ createdAt: -1 })
    res.status(200).json({data:allregion})
}
module.exports = GetallRegionArchiev