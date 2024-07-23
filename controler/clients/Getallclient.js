const clientSchema = require('../../model/clientschema')
const Getallclient = async (req , res) => {
    try {
        const clients = await clientSchema.find({})
        res.json({clients})      
    } catch (error) {
        res.send(error.message)
    }
  

}
module.exports = Getallclient