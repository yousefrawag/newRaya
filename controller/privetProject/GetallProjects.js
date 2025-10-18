const PrivetprojectSchema = require("../../model/privetProjectschema");
const userSchema = require("../../model/userSchema")

const getallProjects = async (req, res, next) => {

  
  try {
   
     const iduser = req.token.id
        const user = await userSchema.findById(iduser)
    let filters ;
    if(user.role === 7 || user.type === "admin") {
       filters = {
      }
    }else {
      filters = {
            addedBy:id
    
      }
    }
    
    const data = await PrivetprojectSchema.find({ArchievStatuts: { $in: [false, null] }}).populate("addedBy").sort({ createdAt: -1 });
  
  
    
      res.status(200).json({ data });
 
  
  } catch (error) {
    
    next(error);
  }
};
module.exports = getallProjects;