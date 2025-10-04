const DealyemployeeReports = require("../../model/DealyemployeeReports")

const GetCustomerByid = async (req , res) => {
    const {id} = req.params
    console.log(id);
    
    try {
       
 
 const customers = await DealyemployeeReports.find({
  Customers: id, // يبحث داخل المصفوفة تلقائيًا
}).populate("Customers")
console.log("customer" ,customers );

        if(customers) {
        
          return  res.status(200).json({mesg:"get singale currency" ,data: customers})
        }        
    } catch (error) {
        throw new Error(error)
    }


}
module.exports = GetCustomerByid