const projectSchema = require("../../model/projectSchema");

const GetPropertyInfo = async (req, res, next) => {

  try {

    const { id, propertyId } = req.params;


    const CurrentProject = await projectSchema
      .findById(id)
      .populate("addedBy");



    if(!CurrentProject){
      return res.status(404).json({
        message:"Project not found"
      });
    }



    const property = CurrentProject.properties.find(
      item => item._id.toString() === propertyId
    );



    if(!property){
      return res.status(404).json({
        message:"Property not found"
      });
    }



    res.status(200).json({

      project:{
        _id:CurrentProject._id,
        projectName:CurrentProject.projectName,
        governorate:CurrentProject.governorate,
        detailedAddress:CurrentProject.detailedAddress,
        imagesURLs:CurrentProject.imagesURLs
      },

      property

    });


  } catch (error) {

    next(error);

  }

};


module.exports = GetPropertyInfo;