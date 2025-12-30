const CustomerCallcenter = require("../../model/CustomerCallcenter")
const Update = async (req , res) =>{
    const {id} = req.params
    const {name} = req.body
    const updateNew = await CustomerCallcenter.findByIdAndUpdate(id , {
        ...req.body
    } , {new:true})
    res.status(200).json({mesg:"currency updated " , updateNew});
}
module.exports = Update