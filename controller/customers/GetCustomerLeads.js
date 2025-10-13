const customerSchema = require("../../model/customerSchema");
const projectschema = require("../../model/projectSchema")
const userSchema = require("../../model/userSchema")
const LeadSchemaVistoars = require("../../model/PageVisit")
const GetCustomerLeads = async (req, res, next) => {
  try {

  

   const LeadsVistors = await LeadSchemaVistoars.find({})
   
    
    
const clients = await customerSchema.find({moduleType:"lead" , ArchievStatuts: { $in: [false, null] }}).sort({ createdAt: -1 })
;


 
      

    res.status(200).json({ data:clients  , LeadsVistors});
  } catch (error) {
    next(error);
  }
};

module.exports = GetCustomerLeads;