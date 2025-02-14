const { upload } = require("../../middleware/cloudinary")
const ServicesSchema = require("../../model/Services")
const cloudinary = require("../../middleware/cloudinary");

const Addcservices = async (req , res  , next) => {
    const {title , desc , Features} = req.body

    
    const feturesJson = JSON.parse(Features)
    try {
        if(desc  , title){
            const addnew = await ServicesSchema.create({
                Features:feturesJson,
                title,
                desc
            })
            if(req.file){
                const {imageURL, imageID} = await cloudinary.upload(  req.file.path,
                    "userImages")
                    addnew.image = {
                        imageURL, imageID
                    }
            }
           
            await addnew.save()
            console.log(req.file);
            
           return res.status(200).json({mesg:"currency add sucuufuly" , addnew});
        } else {
            res.status(400).json({mesg:"name is required"})
        }
    } catch (error) {
        next(error)
    }
   

}
const DeleteServices = async (req , res) => {
    const {id} = req.params
    const currentcurrency = await ServicesSchema.findById(id)
    if(currentcurrency) {
        await ServicesSchema.findByIdAndDelete(id)
      return  res.status(200).json({mesg:"services deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
const getAllServices = async (req , res) => {
    const data = await ServicesSchema.find({}).sort({ createdAt: -1 })
    res.status(200).json({data})
}
const SinagleServices = async (req , res) => {
    const {id} = req.params
    console.log(id);
    
    try {
       
 
        const data = await ServicesSchema.findById(id)
        if(data) {
        
          return  res.status(200).json({mesg:"get singale currency " , data})
        }        
    } catch (error) {
        throw new Error(error)
    }


}
const updateServices = async (req, res, next) => {
    const { id } = req.params;
    const { title, desc, Features } = req.body;
    console.log(req.body , id);
    const feturesJson = JSON.parse(Features);

    try {
        // Validate required fields
        if (!title || !desc) {
            return res.status(400).json({ mesg: "Title and description are required" });
        }

        // Find the existing service
        const existingService = await ServicesSchema.findById(id);
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
        if (req.file) {
            // // Delete the old image from Cloudinary if it exists
            // if (existingService.image && existingService.image.imageID) {
            //     await cloudinary.destroy(existingService.image.imageID);
            // }

            // Upload the new image to Cloudinary
            const { imageURL, imageID } = await cloudinary.upload(req.file.path, "userImages");
            updateData.image = { imageURL, imageID };
        }

        // Update the service in the database
        const updatedService = await ServicesSchema.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // Return the updated document
        );

        return res.status(200).json({ mesg: "Service updated successfully", updatedService });
    } catch (error) {
        next(error);
    }
};
module.exports = {getAllServices ,  DeleteServices , Addcservices , SinagleServices , updateServices}