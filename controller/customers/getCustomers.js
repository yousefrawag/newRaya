const customerSchema = require("../../model/customerSchema");
const GetallCustomer = async (req, res, next) => {
  try {
    const { clientStatus , project , _id ,addBy}  =req.query
    let fillters = {}
    if(clientStatus) {
      fillters = {...fillters , clientStatus}
    }
    if(project) {
      fillters = {...fillters  ,project}
    }
    if(addBy) {
      fillters = {...fillters ,addBy}
    }
    if(_id){
      fillters = {...fillters ,_id}
    }
    const Customers = await customerSchema.find(fillters).populate("addBy").populate("project");
    res.status(200).json({ Customers });
  } catch (error) {
    next(error);
  }
};
module.exports = GetallCustomer;
