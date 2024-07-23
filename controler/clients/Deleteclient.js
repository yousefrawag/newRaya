const clientSchema = require('../../model/clientschema')
const Deleteclient = async (req , res) => {
    try {
        const {id} = req.params
        await clientSchema.findByIdAndDelete(id)
        res.json({mesg:'iteam deleting client '})
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = Deleteclient