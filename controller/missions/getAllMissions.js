const missionSchema = require("../../model/missionSchema");
const projectschema = require("../../model/projectSchema")
const PrivetprojectSchema = require("../../model/privetProjectschema")
const userSchema = require("../../model/userSchema")
const getAllMission = async (req, res, next) => {
  try {
 


    const data = await missionSchema
      .find({ArchievStatuts: { $in: [false, null] }})
      .populate("assignedTo")
      .populate(
 "project"
      ) 
      .populate("assignedBy")
      .populate("Privetproject")
    
      .sort({ createdAt: -1 })
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllMission;
