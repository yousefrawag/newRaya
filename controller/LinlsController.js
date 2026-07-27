const LinksSchema =  require("../model/Links")
exports.addNew = async (req , res , next ) => {
        const {name} = req.body
        if(name){
            const addnew = await LinksSchema.create({...req.body})
           return res.status(200).json({mesg:"area add sucuufuly" , name:addnew});
        } else {
            res.status(400).json({mesg:"name is required"})
        }
}
exports.getAll = async (req , res , next) => {
    try {
            const allPayments = await LinksSchema.find({}).sort({ createdAt: -1 })
            res.status(200).json({data:allPayments})
    } catch (error) {
        next(error)
    }
}
exports.Updateone = async (req , res , next) => {
        const {id} = req.params
        const {name} = req.body
        const updateNew = await LinksSchema.findByIdAndUpdate(id , {
            ...req.body
        } , {new:true})
        res.status(200).json({mesg:"payemnts updated " , updateNew});
}
exports.Deleateone = async (req , res , next) => {
        const {id} = req.params
        const currentcurrency = await LinksSchema.findById(id)
        if(currentcurrency) {
            await LinksSchema.findByIdAndDelete(id)
          return  res.status(200).json({mesg:"currency deleted sucssfuly"});
        } else {
            res.status(404).json({mesg:"not found"})
        }
}