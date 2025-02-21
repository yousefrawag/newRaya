const missionSchema = require("../../model/missionSchema");
const projectschema = require("../../model/projectSchema")
const PrivetprojectSchema = require("../../model/privetProjectschema")
const userSchema = require("../../model/userSchema")
const getAllMission = async (req, res, next) => {
  try {
 


    const data = await missionSchema
      .find({})
      .populate("assignedTo")
      .populate({
        path: "project",
        populate: [
          { path: "customers" }, 
          { path: "section" }
        ]
      }) 
      .populate("assignedBy")
      .populate("Privetproject")
    
      .sort({ createdAt: -1 })
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllMission;
