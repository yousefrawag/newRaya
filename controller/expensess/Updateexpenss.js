const ExpensessSchema = require("../../model/Expensess")
const Updateexpenss = async (req , res) =>{
    const {id} = req.params

    const updateNew = await ExpensessSchema.findByIdAndUpdate(id ,req.body , {new:true})
    res.status(200).json({mesg:"currency updated " , updateNew});
}
module.exports = Updateexpenss