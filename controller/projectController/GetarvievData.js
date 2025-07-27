const projectSchema = require("../../model/projectSchema");

const GetarvievData = async (req, res, next) => {

  
  try {





    const data = await projectSchema.find({}).populate("addedBy").sort({ createdAt: -1 });
    const filtered = data.filter(item => item.status?.trim() === 'archiev');
    const projectStatusCount = data.reduce((acc, item) => {
      const status = item.projectStatus; // Extract project status
    
      if (!acc[status]) {
        acc[status] = { status: status, count: 0 }; // Initialize if not exists
      }
    
      acc[status].count += 1; // Increment count
    
      return acc;
    }, {});

    console.log(projectStatusCount);
    
      res.status(200).json({ data:filtered });
 
  
  } catch (error) {
    
    next(error);
  }
};
module.exports = GetarvievData;
