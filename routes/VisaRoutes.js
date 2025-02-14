const express = require("express");
const multerUpload = require("../middleware/multer")

const {getAllvisa ,  Deletevisa , Addevisa , Sinaglevisa , updatevisa} = require("../controller/visaController/VisvaController")
const router  = express.Router()
router.route("/").get(    
 getAllvisa ).post(   multerUpload.fields([
    { name: "image", maxCount: 1 }, 
    { name: "flag", maxCount: 1 },  
  ]), Addevisa)
router.route("/:id").delete(   Deletevisa).put(   multerUpload.fields([
  { name: "image", maxCount: 1 }, 
  { name: "flag", maxCount: 1 },  
]) , updatevisa).get( Sinaglevisa)
module.exports = router;