const projectlocationschema = require("../../model/ProjectLocationschema")
const LocationArchievd = async (req , res) => {
    const allregion = await projectlocationschema.find({ArchievStatuts: true}).sort({ createdAt: -1 })
    res.status(200).json({data:allregion})
}
module.exports = LocationArchievd