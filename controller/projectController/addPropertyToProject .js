const projectSchema = require("../../model/projectSchema");
const cloudinary = require("../../middleware/cloudinary");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");


const addPropertyToProject = async (req, res) => {
const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];


  try {

console.log("BODY => ", req.body);
console.log("FILES => ", req.files);
    const {
      projectId
    } = req.body;

console.log("body" , req.body);

    if(!projectId){
      return res.status(400).json({
        message:"projectId required"
      });
    }



    const project = await projectSchema.findById(projectId);



    if(!project){
      return res.status(404).json({
        message:"Project not found"
      });
    }



    let properties = req.body.properties
      ? JSON.parse(req.body.properties)
      : [];



    if(!properties.length){

      return res.status(400).json({
        message:"No properties"
      });

    }



    // تجهيز الصور

    properties = properties.map(item=>({
      ...item,
      imagesURLs:[],
      videosURLs:[],
      docsURLs:[]
    }));





    // رفع الصور

    if(req.files?.length){


      for(const file of req.files){


        /**
         * 
         * propertyImages_0
         * propertyImages_1
         * 
         */


        if(file.fieldname.startsWith("propertyImages")){


          const index =
          Number(file.fieldname.split("_")[1]);



          if(properties[index]){


            if(allowedTypes.includes(file.mimetype)){



              const {
                imageURL:fileURL,
                imageID:fileID

              } = await cloudinary.upload(
                file.path,
                "projectFiles/property/images"
              );



              properties[index]
              .imagesURLs
              .push({
                fileURL,
                fileID
              });



            }


          }


        }



      }


    }






    // اضافة الشقق للمشروع القديم

    project.properties.push(
      ...properties
    );



    await project.save();




    // Notification

    const admins = await userSchema.find({
      $or:[
        {
          type:"admin"
        },
        {
          role:9
        }
      ]
    });



    const notifications = admins.map(admin=>({

      user:admin._id,
      employee:req.token.id,
      levels:"projects",
      type:"add",
      allowed:project._id,
      message:"تم إضافة شقق جديدة للمشروع"

    }));


    if(notifications.length){

      await notificationSchema.insertMany(
        notifications
      );

    }




    return res.status(200).json({

      message:"Properties added successfully",
      project

    });



  }catch(error){


    return res.status(500).json({

      message:"Add property failed",
      error:error.message

    });


  }


};



module.exports = addPropertyToProject;