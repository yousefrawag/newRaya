const projectlocationschema = require("../../model/ProjectLocationschema")
const updateLocation = async (req , res) =>{
    const {id} = req.params
    const {name} = req.body
    const updateNew = await projectlocationschema.findByIdAndUpdate(id , {
        name
    } , {new:true})
    res.status(200).json({mesg:"location updated " , updateNew});
}
module.exports = updateLocation