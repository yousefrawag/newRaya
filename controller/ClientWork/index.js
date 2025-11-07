const ClientWorkSchema = require("../../model/ClientWork")
 const AddWork = async (req , res) => {
    const {name} = req.body
    if(name){
        const addnew = await ClientWorkSchema.create({...req.body})
       return res.status(200).json({mesg:"currency add sucuufuly"});
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
 const DeleteWork = async (req , res) => {
    const {id} = req.params
    const currentcurrency = await ClientWorkSchema.findById(id)
    if(currentcurrency) {
        await ClientWorkSchema.findByIdAndDelete(id)
      return  res.status(200).json({mesg:"currency deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }}
const getAllWorks = async (req , res) => {
    const allCurrency = await ClientWorkSchema.find({}).sort({ createdAt: -1 })
    res.status(200).json({data:allCurrency})
}
const updatework = async (req , res) =>{
    const {id} = req.params
    const {name} = req.body
    const updateNew = await ClientWorkSchema.findByIdAndUpdate(id , {
        ...req.body
    } , {new:true})
    res.status(200).json({mesg:"currency updated " , updateNew});
}
module.exports = {
    AddWork ,
    DeleteWork ,
    getAllWorks ,
    updatework
}