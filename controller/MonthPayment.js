const MonthpaymentSchema =  require("../model/Monthpayment")
exports.addNew = async (req , res , next ) => {
        const {name} = req.body
        if(name){
            const addnew = await MonthpaymentSchema.create({name})
           return res.status(200).json({mesg:"area add sucuufuly" , name:addnew});
        } else {
            res.status(400).json({mesg:"name is required"})
        }
}
exports.getAll = async (req , res , next) => {
    try {
            const allPayments = await MonthpaymentSchema.find({}).sort({ createdAt: -1 })
            res.status(200).json({data:allPayments})
    } catch (error) {
        next(error)
    }
}
exports.Updateone = async (req , res , next) => {
        const {id} = req.params
        const {name} = req.body
        const updateNew = await MonthpaymentSchema.findByIdAndUpdate(id , {
            name
        } , {new:true})
        res.status(200).json({mesg:"payemnts updated " , updateNew});
}
exports.Deleateone = async (req , res , next) => {
        const {id} = req.params
        const currentcurrency = await MonthpaymentSchema.findById(id)
        if(currentcurrency) {
            await MonthpaymentSchema.findByIdAndDelete(id)
          return  res.status(200).json({mesg:"currency deleted sucssfuly"});
        } else {
            res.status(404).json({mesg:"not found"})
        }
}