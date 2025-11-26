const regionScgema= require("../../model/regionSchema")
const updateRegion = async (req , res) =>{
    const {id} = req.params
    const {name} = req.body
    const updateNew = await regionScgema.findByIdAndUpdate(id , {
        ...req.body
    } , {new:true})
    res.status(200).json({mesg:"region updated " , updateNew});
}
module.exports = updateRegion