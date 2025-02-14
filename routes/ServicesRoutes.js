const express = require("express");
const multerUpload = require("../middleware/multer")
const authorizationMW = require("../middleware/authorizationMW");

const {getAllServices ,  DeleteServices , Addcservices , SinagleServices , updateServices} = require("../controller/Services/ServicesController")
const router  = express.Router()
router.route("/").get( 
  
    getAllServices 

).post(     multerUpload.single("image"), Addcservices)
router.route("/:id").delete(   DeleteServices).put(    updateServices).get( SinagleServices)
module.exports = router;