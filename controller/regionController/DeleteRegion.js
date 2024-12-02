const regionScgema= require("../../model/regionSchema")

const DeleteRegion = async (req , res) => {
    const {id} = req.params
    const currentregion = await regionScgema.findById(id)
    if(currentregion) {
        await regionScgema.findByIdAndDelete(id)
        res.status(200).json({mesg:"currency deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
module.exports = DeleteRegion