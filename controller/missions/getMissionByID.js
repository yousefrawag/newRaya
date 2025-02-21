const missionSchema = require("../../model/missionSchema");
const { populate } = require("../../model/roleSchema");

const getMissionByID = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await missionSchema
      .findById(id)
      .populate("assignedTo")
      .populate("project") // Populate project
      .populate({
        path: "project",
        populate: [
          { path: "customers" }, 
          { path: "section" }
        ]
      })      
      .populate("Privetproject")
      .populate("assignedBy")
   
    if (!data) {
     return res.json({ message: "this mission doesn't exist" });
    }

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
module.exports = getMissionByID;
