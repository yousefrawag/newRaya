const customerSchema = require("../../model/customerSchema");
const projectSchema = require("../../model/projectSchema");

const insertMany  = async (req  ,res) => {
  console.log(req.body)
    try {
      const  jsonData = req.body;
      const getProjectId = async (projectName) => {
        const project = await projectSchema.findOne({ projectName }).exec();
        return project ? project._id : null;
      };
      const vailData = await Promise.all(jsonData.map(async(item) => {
        const projectId = await getProjectId(item.project);
        return {
        
          fullName:item.fullName || "",
          region:item.region || "",
          phoneNumber:item.phoneNumber || "",
          secondaryPhoneNumber:item.secondaryPhoneNumber || "",
          currency:item.currency || "",
          firstPayment:item.firstPayment || "",
          clientStatus:item.clientStatus || "New",
          project:projectId ,
          notes:item.notes || "",
          clientRequire:item.clientRequire || "" ,
          clientendRequr:item.clientEndRequr || "",
          addBy:req.token.id

        }
      })) 
       
        await customerSchema.insertMany(vailData);
        
        res.status(200).json({vailData})
      } catch (err) {
        console.error("jokes-bulk-insert error: ", err);
        res.status(500).json({ success: false, message: "internal_server_error" });
      }
   
}
module.exports = insertMany