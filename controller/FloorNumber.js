const FloorNumbersSchema =  require("../model/FloorNumbers")
exports.addNew = async (req , res , next ) => {
        const {name} = req.body
        if(name){
            const addnew = await FloorNumbersSchema.create({name})
           return res.status(200).json({mesg:"area add sucuufuly" , name:addnew});
        } else {
            res.status(400).json({mesg:"name is required"})
        }
}
exports.getAll = async (req , res , next) => {
    try {
            const allPayments = await FloorNumbersSchema.find({}).sort({ createdAt: -1 })
            res.status(200).json({data:allPayments})
    } catch (error) {
        next(error)
    }
}
exports.Updateone = async (req , res , next) => {
        const {id} = req.params
        const {name} = req.body
        const updateNew = await FloorNumbersSchema.findByIdAndUpdate(id , {
            name
        } , {new:true})
        res.status(200).json({mesg:"payemnts updated " , updateNew});
}
exports.Deleateone = async (req , res , next) => {
        const {id} = req.params
        const currentcurrency = await FloorNumbersSchema.findById(id)
        if(currentcurrency) {
            await FloorNumbersSchema.findByIdAndDelete(id)
          return  res.status(200).json({mesg:"currency deleted sucssfuly"});
        } else {
            res.status(404).json({mesg:"not found"})
        }
}