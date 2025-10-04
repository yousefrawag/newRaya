const customerSchema = require("../../model/customerSchema");
const PrivetprojectSchema = require("../../model/privetProjectschema");
const userSchema = require("../../model/userSchema")
const GetArchivedData = async (req, res, next) => {
  try {
    const { field, searTerm , startDate , endDate } = req.query;
    const id = req.token.id
    const user = await userSchema.findById(id)
    const CurrentPermission = user?.role === 9
    let filters =  {ArchievStatuts:true}
    // if(user.type === "admin" || CurrentPermission) {
    //    filters = {
    //        ...filters ,
    //    };
    // }else{
    //   filters = {
    //     ...filters ,
    //     addBy: {
    //       $regex: new RegExp(`(^|\\s|\\/)+${user?.fullName.trim()}($|\\s|\\/)`, 'i') // Match name as part of a shared or individual value
    //     }
    //   };     
    // }

   
   
    
    
const Privetproject = await PrivetprojectSchema.find({ArchievStatuts:true}).populate("addedBy");


 
      

    res.status(200).json({ data:Privetproject });
  } catch (error) {
    next(error);
  }
};

module.exports = GetArchivedData;