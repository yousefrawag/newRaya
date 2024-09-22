const invoiceSchema = require("../../model/invoiceSchema");
const getAllInvoices = async (req, res, next) => {
  try {
    const {project  ,  client , status} = req.query
    let fillter = {}
    if(project) {
      fillter = {...fillter , project}
    }
    if(client){
      fillter = {...fillter , client}
    }
    if(status){
      fillter = {...fillter , status}
    }
    const invoices = await invoiceSchema
      .find(fillter)
      .populate("client")
      .populate("project")
      .sort({ createdAt: -1 })
    res.status(200).json({ invoices });
  } catch (error) {
    next(error);
  }
};
module.exports = getAllInvoices;
