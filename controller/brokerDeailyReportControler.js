const DealyemployeeReports = require("../model/brokerDeailyReports")
const cloudinary = require("../middleware/cloudinary");
const { json } = require("express");
const AddDealyReport = async (req , res) => {
    const {ReportType} = req.body

    if(ReportType){
        const addnew = new DealyemployeeReports(req.body)
            const imagesURLs = [];
            const videosURLs = [];
            const docsURLs = [];
            if (req.files) {
              for (const index in req.files) {
        
                if (
                  req.files[index].mimetype === "image/png" ||
                  req.files[index].mimetype === "image/jpeg"
                ) {
        
                  const { imageURL: fileURL, imageID: fileID } =
                    await cloudinary.upload(
                      req.files[index].path,
                      "projectFiles/images"
                    );
                  imagesURLs.push({ fileURL, fileID });
                } else if (req.files[index].mimetype === "video/mp4") {
        
                  const { imageURL: fileURL, imageID: fileID } =
                    await cloudinary.upload(
                      req.files[index].path,
                      "projectFiles/videos"
                    );
                  videosURLs.push({ fileURL, fileID });
                } else   {
        
                  const { imageURL: fileURL, imageID: fileID } =
                    await cloudinary.upload(req.files[index].path, "projectFiles/docs" , {
                       resource_type: "raw",
                    });
                  docsURLs.push({ fileURL, fileID });
                }
              }
            }
            addnew.imagesURLs = imagesURLs;
            addnew.videosURLs = videosURLs;
            addnew.docsURLs = docsURLs;
        addnew.addedBy = req.token.id
        await addnew.save()
       return res.status(200).json({mesg:"ReportType add sucuufuly"});
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}

const DelateOne = async (req , res) => {
    const {id} = req.params
    const currentDelay = await DealyemployeeReports.findById(id)
    if(currentDelay) {
        await DealyemployeeReports.findByIdAndDelete(id)
      return  res.status(200).json({mesg:"currency deleted sucssfuly"});
    } else {
        res.status(404).json({mesg:"not found"})
    }
}
const GetAllReports = async (req, res, next) => {
  try {
    const { field, searTerm , startDate , endDate } = req.query;
           const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      dateFilter.createdAt = { $lte: new Date(endDate) };
    }

    // 🔍 الفلترة الأساسية (مثل البحث أو غيره)
    const filter = {
   
      ...dateFilter,
    };
    const data = await DealyemployeeReports
      .find(filter)
      .populate("Customer")
      .populate("addedBy")

    
      .sort({ createdAt: -1 })
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
const GetByid = async (req , res) => {
    const {id} = req.params
    console.log(id);
    
    try {
       
 
        const currency = await DealyemployeeReports.findById(id)
        if(currency) {
        
          return  res.status(200).json({mesg:"get singale currency " ,data: currency})
        }        
    } catch (error) {
        throw new Error(error)
    }


}
const GetCustomerByid = async (req , res) => {
    const {id} = req.params
    console.log(id);
    
    try {
       
 
 const customers = await DealyemployeeReports.find({
  Customers: id, // يبحث داخل المصفوفة تلقائيًا
}).populate("Customer")
console.log("customer" ,customers );

        if(customers) {
        
          return  res.status(200).json({mesg:"get singale currency" ,data: customers})
        }        
    } catch (error) {
        throw new Error(error)
    }


}
const GetUserReports = async (req, res, next) => {
  try {
    const { field, searTerm , startDate , endDate } = req.query;
       const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      dateFilter.createdAt = { $lte: new Date(endDate) };
    }

    // 🔍 الفلترة الأساسية (مثل البحث أو غيره)
    const filter = {
      addedBy: req.token.id,
      ...dateFilter,
    };
    const data = await DealyemployeeReports
      .find(filter)
      .populate("Customer")
      .populate("addedBy")

    
      .sort({ createdAt: -1 })
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
const UpdateDealy= async (req , res) =>{
    const {id} = req.params

    const updateNew = await DealyemployeeReports.findByIdAndUpdate(id ,req.body , {new:true})
    res.status(200).json({mesg:"currency updated " , updateNew});
}
module.exports = {AddDealyReport , UpdateDealy, GetUserReports,DelateOne , GetAllReports , GetByid , GetCustomerByid}