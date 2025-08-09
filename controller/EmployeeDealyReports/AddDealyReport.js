const DealyemployeeReports = require("../../model/DealyemployeeReports")
const cloudinary = require("../../middleware/cloudinary");
const { json } = require("express");
const AddDealyReport = async (req , res) => {
    const {ReportType , Customers} = req.body
    req.body.Customers = JSON.parse(Customers)
    if(ReportType){
        const addnew = new DealyemployeeReports(req.body)
            const docsURLs = [];
            if (req.files) {
              for (const index in req.files) {
        
         
        
                  const { imageURL: fileURL, imageID: fileID } =
                    await cloudinary.upload(req.files[index].path, "projectFiles/docs");
                  docsURLs.push({ fileURL, fileID });
              
              }
            }
         addnew.docsURLs = docsURLs;
        addnew.addedBy = req.token.id
        await addnew.save()
       return res.status(200).json({mesg:"ReportType add sucuufuly"});
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
module.exports = AddDealyReport