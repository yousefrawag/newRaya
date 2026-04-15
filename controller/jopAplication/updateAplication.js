const AplicationModule= require("../../model/AplicationModule")
const updateAplication = async (req , res) =>{
    console.log(req.body);
    const {id} = req.params
    const {applicationStatus} = req.body
console.log(req.body);
if(!applicationStatus){
    return res.status(404).json({mesg:"applicationStatus not found"})
}

    const updateNew = await AplicationModule.findByIdAndUpdate(id ,req.body , {new:true})
    res.status(200).json({mesg:"aplication updated " , updateNew});
}
module.exports = updateAplication