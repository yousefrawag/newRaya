const DealyemployeeReports = require("../../model/DealyemployeeReports")
const Updateexpenss = async (req , res) =>{
    const {id} = req.params

    const updateNew = await DealyemployeeReports.findByIdAndUpdate(id ,req.body , {new:true})
    res.status(200).json({mesg:"currency updated " , updateNew});
}
module.exports = Updateexpenss