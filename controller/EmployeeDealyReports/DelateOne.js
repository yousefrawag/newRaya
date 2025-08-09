const DealyemployeeReports = require("../../model/DealyemployeeReports")

const DelateOne = async (req , res) => {
    const {id} = req.params
    const currentDelay = await DealyemployeeReports.findById(id)
    if(currentDelay) {
        await DealyemployeeReports.findByIdAndDelete(id)
      return  res.status(200).json({mesg:"currency deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
module.exports = DelateOne