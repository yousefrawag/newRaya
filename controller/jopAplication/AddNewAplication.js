const AplicationModule= require("../../model/AplicationModule")
const AddNewAplication = async (req , res) => {
    const {personalInfo} = req.body
    if(personalInfo.fullName){
        const addnew = await AplicationModule.create({...req.body})
     return   res.status(200).json({mesg:"region  add sucuufuly" ,addnew });
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
module.exports = AddNewAplication
