const CustomerCallcenter = require("../../model/CustomerCallcenter")
const AddNew = async (req , res) => {
    const {name} = req.body
    if(name){
        const addnew = await CustomerCallcenter.create({name})
       return res.status(200).json({mesg:"call center customer  add sucuufuly"});
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
module.exports = AddNew