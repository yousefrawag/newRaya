const projectSchema = require('../../model/projectSchema')
const updateProject = async (req , res) => {
    const {id} = req.params
    const {
        estateType , governorate , city ,
         esateNumber , specificEstate 
        , clientType , esatePrice , opertaionType , installments,
        installmentsForYear , areeMater , FinishingQuality ,
        imagesVideos , docs , addingBy
    } = req.body
    try {
        const findProject = await projectSchema.findByIdAndUpdate(id , {
            estateType , governorate , city ,
            esateNumber , specificEstate 
           , clientType , esatePrice , opertaionType , installments,
           installmentsForYear , areeMater , FinishingQuality ,
           imagesVideos , docs , addingBy
        },{new:true})
        res.json({ mesg:"project updated true", findProject})
    } catch (error) {
        res.send(error)
    }
}
module.exports = updateProject