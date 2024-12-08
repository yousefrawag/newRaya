const projectStatuts = require("../../model/projectStatuts")
const Addprojectstatuts = async (req , res) => {
    const {name} = req.body
    if(name){
        const addnew = await projectStatuts.create({name})
       return res.status(200).json({mesg:"sattuts add sucuufuly" ,addnew });
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
module.exports = Addprojectstatuts