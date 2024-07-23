const clientSchema = require('../../model/clientschema')
const SpasficClient = async (req ,res) => {
try {
    const {id}  = req.params
    const currentclient = await clientSchema.findById(id)
    if(currentclient.length > 0){
        return res.json({currentclient})
    }else{
        return res.send("this client is not avilabile in db")
    }
} catch (error) {
    res.send(error.message)
}
}
module.exports = SpasficClient