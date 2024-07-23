const mediatorSchema = require('../../model/mediatorSchema')
const Spasficmediator =  async (req , res) => {
    try {
        const {id}  = req.params
        const currentmediator = await mediatorSchema.findById(id)
        
            return res.json({currentmediator})
     
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = Spasficmediator