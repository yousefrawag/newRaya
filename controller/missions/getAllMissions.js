const missionSchema = require("../../model/missionSchema");
const projectschema = require("../../model/projectSchema")
const PrivetprojectSchema = require("../../model/privetProjectschema")
const userSchema = require("../../model/userSchema")
const getAllMission = async (req, res, next) => {
  try {
    const {field , searTerm , startDate , endDate } = req.query
    let filter = {}
    if( ["missionType" , "title" , "status"].includes(field) && searTerm) {
      filter[field] =  { $regex: new RegExp(searTerm, 'i') }
    }
   if (field === "project" && searTerm) {
const foundProject = await projectschema.find({projectName:{ $regex: new RegExp(searTerm, 'i') }})
if(foundProject && foundProject.length) {
  filter[field] = foundProject[0]?._id
}
  }
   if(field === "Privetproject" && searTerm) {
    const foundProject = await PrivetprojectSchema.find({projectName:{ $regex: new RegExp(searTerm, 'i') }})
    if(foundProject && foundProject.length) {
      console.log(field , searTerm)
      filter[field] = foundProject[0]?._id
    }
  }

  if(field === "assignedTo" && searTerm) {
    const foundProject = await userSchema.find({fullName:{ $regex: new RegExp(searTerm, 'i') }})
    if(foundProject && foundProject.length) {
      console.log(field , searTerm)
      filter[field] = foundProject[0]?._id
    }
  }
if(["deadline" , "createdAt"].includes(field) && endDate){
  filter[field] = {
    $gte: new Date(startDate),  // greater than or equal to fromDate
    $lte: new Date(endDate) 
  }
}

    const data = await missionSchema
      .find({})
      .populate("assignedTo")
      .populate("project")
      .populate("assignedBy")
      .populate("Privetproject")
      .populate("section")
      .sort({ createdAt: -1 })
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllMission;
