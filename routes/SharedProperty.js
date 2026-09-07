const express = require("express");
const { getAllProperties , getProperty , sendSharedPropertyAsProject ,deleteProperty , updateProperty , createProperty } = require("../controller/SharedPropertyController");
const multerUpload = require("../middleware/multer");
const protect = require("../middleware/authenticationMW");


const router = express.Router();
router.put("/convert/:id" , protect , sendSharedPropertyAsProject)
router.route("/").post(multerUpload.array('files'), createProperty).get(getAllProperties);
router.route("/:id").get(getProperty).put(multerUpload.array('files')  , updateProperty).delete(deleteProperty);

module.exports = router;
