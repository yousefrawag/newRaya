const regionScgema= require("../../model/regionSchema")
const AddRegion = async (req , res) => {
    const {name} = req.body
    if(name){
        const addnew = await regionScgema.create({name})
     return   res.status(200).json({mesg:"region  add sucuufuly" ,addnew });
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
module.exports = AddRegion