const AplicationModule= require("../../model/AplicationModule")

const DeleateAplication = async (req , res) => {
    const {id} = req.params
    const currentregion = await AplicationModule.findById(id)
    if(currentregion) {
        await AplicationModule.findByIdAndDelete(id)
       return res.status(200).json({mesg:"currency deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
module.exports = DeleateAplication