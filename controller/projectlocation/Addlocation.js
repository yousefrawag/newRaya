const projectlocationschema = require("../../model/ProjectLocationschema")
const Addlocation = async (req , res) => {
    const {name} = req.body
    if(name){
        const addnew = await projectlocationschema.create({name})
     return   res.status(200).json({mesg:"location  add sucuufuly" ,addnew });
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
module.exports = Addlocation