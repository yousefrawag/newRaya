const express = require("express");
const { getAllProperties , getProperty , deleteProperty , updateProperty , createProperty } = require("../controller/SharedPropertyController");
const multerUpload = require("../middleware/multer");

const router = express.Router();

router.route("/").post(multerUpload.array('files'), createProperty).get(getAllProperties);
router.route("/:id").get(getProperty).put(multerUpload.array('files')  , updateProperty).delete(deleteProperty);

module.exports = router;
