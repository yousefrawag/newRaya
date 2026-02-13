const projectlocationschema = require("../../model/ProjectLocationschema")
const Getprojectlocation = async (req , res) => {
    const allregion = await projectlocationschema.find({ArchievStatuts: { $in: [false, null] }}).sort({ createdAt: -1 })
    res.status(200).json({data:allregion})
}
module.exports = Getprojectlocation