const AplicationModule= require("../model/SurverAplication")
const AddNewAplication = async (req , res) => {
    const {name} = req.body
    if(name){
        const addnew = await AplicationModule.create({...req.body})
     return   res.status(200).json({mesg:"region  add sucuufuly" ,addnew });
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
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
const GetAllPlications = async (req , res) => {
    const allAplications = await AplicationModule.find({}).sort({ createdAt: -1 })
    res.status(200).json({data:allAplications})
}
const GetAplicationId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await AplicationModule.findById(id)

    res.status(200).json({mesg:"get full aplication data" ,  data });
  } catch (error) {
    next(error);
  }
}
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
module.exports = {AddNewAplication , DeleateAplication , GetAllPlications , GetAplicationId , updateAplication }
