const projectSchema = require("../../model/projectSchema");

const getallProjects = async (req, res, next) => {

  
  try {


  
    
    const data = await projectSchema.find({}).populate("addedBy").sort({ createdAt: -1 });
    const projectStatusCount = data.reduce((acc, item) => {
      const status = item.projectStatus; // Extract project status
    
      if (!acc[status]) {
        acc[status] = { status: status, count: 0 }; // Initialize if not exists
      }
    
      acc[status].count += 1; // Increment count
    
      return acc;
    }, {});

    console.log(projectStatusCount);
    
      res.status(200).json({ data });
 
  
  } catch (error) {
    
    next(error);
  }
};
module.exports = getallProjects;
