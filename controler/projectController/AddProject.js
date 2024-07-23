const projectSchema = require('../../model/projectSchema')
const AddProject = async (req ,res) => {
    try {
        const {
            estateType , governorate , city ,
             esateNumber , specificEstate 
            , clientType , esatePrice , opertaionType , installments,
            installmentsForYear , areeMater , FinishingQuality ,
            imagesVideos , docs 
        } = req.body
        if(!clientType || !city || !esateNumber || !specificEstate || !opertaionType || !installments  || !FinishingQuality  || !estateType){
          return  res.send("all vailds are requierd")
        } 
        const newProject =await projectSchema.create({
            estateType , governorate , city ,
             esateNumber , specificEstate 
            , clientType , esatePrice , opertaionType , installments,
            installmentsForYear , areeMater , FinishingQuality,
            imagesVideos , docs , addingBy :req.user._id
        })
    res.json({newProject})
    } catch (error) {
        throw new Error(error)
    }

}
module.exports = AddProject