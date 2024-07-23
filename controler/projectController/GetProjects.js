const projectSchema = require('../../model/projectSchema')
const GetallProjects = async (req ,res) => {
   const allproject = await  projectSchema.find({}).populate("addingBy")
   res.json({allproject})
}
module.exports = GetallProjects