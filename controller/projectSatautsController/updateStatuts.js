const projectStatuts = require("../../model/projectStatuts")
const updateprojectStatuts = async (req , res) =>{
    const {id} = req.params
    const {name} = req.body
    const updateNew = await projectStatuts.findByIdAndUpdate(id , {
        name
    } , {new:true})
    res.status(200).json({mesg:"statuts updated " , updateNew});
}
module.exports = updateprojectStatuts