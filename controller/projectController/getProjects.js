const projectSchema = require("../../model/projectSchema");
const userSchema = require("../../model/userSchema")
const getallProjects = async (req, res, next) => {

  
  try {
  const id = req.token.id
    const user = await userSchema.findById(id)
let filters ;
if(user.role === 9 || user.type === "admin") {
   filters = {
  }
}else {
  filters = {
        addedBy:id

  }
}



    const data = await projectSchema.find(filters).populate("addedBy").sort({ createdAt: -1 });
    const filtered = data.filter(item => item.status?.trim() === 'process');
    const projectStatusCount = data.reduce((acc, item) => {
      const status = item.projectStatus; // Extract project status
    
      if (!acc[status]) {
        acc[status] = { status: status, count: 0 }; // Initialize if not exists
      }
    
      acc[status].count += 1; // Increment count
    
      return acc;
    }, {});

    const data3 = filtered.map((item) =>( {
  ...item.toObject(),
    projectName:item.projectName?.trim()
    }))
    
      res.status(200).json({ data:data3 });
 
  
  } catch (error) {
    
    next(error);
  }
};
module.exports = getallProjects;
