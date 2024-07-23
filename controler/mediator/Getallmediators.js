const mediatorSchema = require('../../model/mediatorSchema')
const Getallmediators = async (req , res) =>{
    try {
        const mediators = await mediatorSchema.find({})
        res.json({mediators})      
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = Getallmediators