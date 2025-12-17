const arematerSchema =  require("../model/Areamater")
exports.addNew = async (req , res , next ) => {
        const {name} = req.body
        if(name){
            const addnew = await arematerSchema.create({name})
           return res.status(200).json({mesg:"area add sucuufuly" , arae:addnew});
        } else {
            res.status(400).json({mesg:"name is required"})
        }
}
exports.getAll = async (req , res , next) => {
    try {
            const allareas = await arematerSchema.find({}).sort({ createdAt: -1 })
            res.status(200).json({data:allareas})
    } catch (error) {
        next(error)
    }
}
exports.Updateone = async (req , res , next) => {
        const {id} = req.params
        const {name} = req.body
        const updateNew = await arematerSchema.findByIdAndUpdate(id , {
            name
        } , {new:true})
        res.status(200).json({mesg:"currency updated " , updateNew});
}
exports.Deleateone = async (req , res , next) => {
        const {id} = req.params
        const currentcurrency = await arematerSchema.findById(id)
        if(currentcurrency) {
            await arematerSchema.findByIdAndDelete(id)
          return  res.status(200).json({mesg:"currency deleted sucssfuly"});
        } else {
            res.status(404).json({mesg:"not found"})
        }
}