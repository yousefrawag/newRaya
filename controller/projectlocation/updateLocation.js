const projectlocationschema = require("../../model/ProjectLocationschema")
const updateLocation = async (req , res) =>{
    const {id} = req.params
    const {name} = req.body
    try {
           const updateNew = await projectlocationschema.findByIdAndUpdate(id , {
        ...req.body
    } , {new:true})
    res.status(200).json({mesg:"location updated " , updateNew});
    } catch (error) {
        throw new Error(error)
    }
 
}
module.exports = updateLocation