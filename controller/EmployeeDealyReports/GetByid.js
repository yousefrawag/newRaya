const DealyemployeeReports = require("../../model/DealyemployeeReports")

const GetByid = async (req , res) => {
    const {id} = req.params
    console.log(id);
    
    try {
       
 
        const currency = await DealyemployeeReports.findById(id)
        if(currency) {
        
          return  res.status(200).json({mesg:"get singale currency " ,data: currency})
        }        
    } catch (error) {
        throw new Error(error)
    }


}
module.exports = GetByid