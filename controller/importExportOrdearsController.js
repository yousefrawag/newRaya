const ImportexportOrdersSchema =  require("../model/ImportexportOrders")
exports.addNew = async (req , res , next ) => {
        const {clientId} = req.body
        if(clientId){
            req.body.addedBy = req.token.id
            const addnew = await ImportexportOrdersSchema.create({...req.body})
           return res.status(200).json({mesg:"area add sucuufuly" , name:addnew});
        } else {
            res.status(400).json({mesg:"name is required"})
        }
}
exports.getAll = async (req , res , next) => {
    try {
            const allOrdears = await ImportexportOrdersSchema.find({}).populate("clientId").populate("addedBy").sort({ createdAt: -1 })
            res.status(200).json({data:allOrdears})
    } catch (error) {
        next(error)
    }
}
exports.Updateone = async (req , res , next) => {
        const {id} = req.params
        const {clientId} = req.body
        const updateNew = await ImportexportOrdersSchema.findByIdAndUpdate(id , {
            ...req.body
        } , {new:true})
        res.status(200).json({mesg:"payemnts updated " , updateNew});
}
exports.Deleateone = async (req , res , next) => {
        const {id} = req.params
        const currentcurrency = await ImportexportOrdersSchema.findById(id)
        if(currentcurrency) {
            await ImportexportOrdersSchema.findByIdAndDelete(id)
          return  res.status(200).json({mesg:"currency deleted sucssfuly"});
        } else {
            res.status(404).json({mesg:"not found"})
        }
}
exports.Getone = async (req , res , next) => {
        const {id} = req.params
        const ordear = await ImportexportOrdersSchema.findById(id).populate("clientId").populate("addedBy")
        if(ordear) {
          
          return  res.status(200).json({mesg:"get ordaer overview" , data:ordear});
        } else {
            res.status(404).json({mesg:"not found"})
        }
}