const missionSchema = require("../../model/missionSchema");
const GetArchevedMission = async (req, res, next) => {
  try {
    const { field, searTerm , startDate , endDate } = req.query;


   
    
    
const Privetproject = await missionSchema.find({ArchievStatuts:true})     .populate("assignedTo")
      .populate(
 "project"
      ) 
      .populate("assignedBy")
      .populate("Privetproject")
    
      .sort({ createdAt: -1 })


 
      

    res.status(200).json({ data:Privetproject });
  } catch (error) {
    next(error);
  }
};

module.exports = GetArchevedMission;