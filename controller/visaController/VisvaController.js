const { upload } = require("../../middleware/cloudinary")
const VisaSchema = require("../../model/Visamodule")
const cloudinary = require("../../middleware/cloudinary");

const Addevisa = async (req, res, next) => {
    const { title, Features } = req.body;
    const feturesJson = JSON.parse(Features);
  console.log(feturesJson);
  
    try {
      if (title) {
        const addnew = await VisaSchema.create({
          Features: feturesJson,
          title,
        });
  
        // Check if files were uploaded
        if (req.files) {
          // Handle the first image (country landmarks)
          if (req.files["image"]) {
            const { imageURL, imageID } = await cloudinary.upload(
              req.files["image"][0].path,
              "userImages"
            );
            addnew.image = { imageURL, imageID };
          }
  
          // Handle the second image (country flag)
          if (req.files["flag"]) {
            const { imageURL, imageID } = await cloudinary.upload(
              req.files["flag"][0].path,
              "userImages"
            );
            addnew.flag = { imageURL, imageID };
          }
  
          await addnew.save();
        }
  
        return res.status(200).json({ mesg: "Visa added successfully", addnew });
      } else {
        res.status(400).json({ mesg: "Title is required" });
      }
    } catch (error) {
      next(error);
    }
  };
const Deletevisa = async (req , res) => {
    const {id} = req.params
    const currentcurrency = await VisaSchema.findById(id)
    if(currentcurrency) {
        await VisaSchema.findByIdAndDelete(id)
      return  res.status(200).json({mesg:"services deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
const getAllvisa = async (req , res) => {
    const data = await VisaSchema.find({}).sort({ createdAt: -1 })
    res.status(200).json({data})
}
const Sinaglevisa = async (req , res) => {
    const {id} = req.params
    console.log(id);
    
    try {
       
 
        const data = await VisaSchema.findById(id)
        if(data) {
        
          return  res.status(200).json({mesg:"get singale currency " , data})
        }        
    } catch (error) {
        throw new Error(error)
    }


}
const updatevisa = async (req, res, next) => {
    const { id } = req.params;
    const { title, desc, Features } = req.body;
    console.log(req.body , id);
    const feturesJson = JSON.parse(Features);

    try {
        // Validate required fields
        if (!title) {
            return res.status(400).json({ mesg: "Title and description are required" });
        }

        // Find the existing service
        const existingService = await VisaSchema.findById(id);
        if (!existingService) {
            return res.status(404).json({ mesg: "Service not found" });
        }

        // Prepare the update object
        const updateData = {
            title,
            desc,
            Features: feturesJson,
        };

        // If a new image is uploaded, update the image in Cloudinary
        if (req.files) {
          // Handle the first image (country landmarks)
          if (req.files["image"]) {
            const { imageURL, imageID } = await cloudinary.upload(
              req.files["image"][0].path,
              "userImages"
            );
            updateData.image = { imageURL, imageID };
          }
  
          // Handle the second image (country flag)
          if (req.files["flag"]) {
            const { imageURL, imageID } = await cloudinary.upload(
              req.files["flag"][0].path,
              "userImages"
            );
            updateData.flag = { imageURL, imageID };
          }
  
         
        }

        // Update the service in the database
        const updatedService = await VisaSchema.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // Return the updated document
        );

        return res.status(200).json({ mesg: "Service updated successfully", updatedService });
    } catch (error) {
        next(error);
    }
};
module.exports = {getAllvisa ,  Deletevisa , Addevisa , Sinaglevisa , updatevisa}