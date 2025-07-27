const DealyemployeeReports = require("../../model/DealyemployeeReports")
const AddDealyReport = async (req , res) => {
    const {ReportType} = req.body
    if(ReportType){
        const addnew = new DealyemployeeReports(req.body)
        addnew.addedBy = req.token.id
        await addnew.save()
       return res.status(200).json({mesg:"ReportType add sucuufuly"});
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
module.exports = AddDealyReport