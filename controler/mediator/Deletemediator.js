const mediatorSchema = require('../../model/mediatorSchema')
const Deletemediator = async (req  ,res)=>{
    try {
        const {id} = req.params
        await mediatorSchema.findByIdAndDelete(id)
        res.json({mesg:'iteam deleting client '})
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = Deletemediator