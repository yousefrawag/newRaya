const AplicationModule= require("../../model/AplicationModule")
const GetAllPlications = async (req , res) => {
    const allAplications = await AplicationModule.find({ArchievStatuts: { $in: [false, null] }}).sort({ createdAt: -1 })
    res.status(200).json({data:allAplications})
}
module.exports = GetAllPlications