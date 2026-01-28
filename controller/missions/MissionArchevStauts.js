const missionSchema = require("../../model/missionSchema");
const path = require("path");

const MissionArchevStauts = async (req, res, next) => {
  const { id } = req.params;
  const {

    ArchievStatuts
   
  } = req.body;

  try {
    

    // Update the mission
    const updatedMission = await missionSchema.findByIdAndUpdate(
      id,
      {

        ArchievStatuts
       
      },
      { new: true }
    );

    if (!updatedMission) {
      return res.status(404).json({ message: "Mission not found" });
    }
 
 
     



    res.status(200).json({ message: "Mission updated successfully", updatedMission });

  } catch (error) {
    console.error("Error updating mission:", error);
    next(error);
  }
};



module.exports = MissionArchevStauts;
