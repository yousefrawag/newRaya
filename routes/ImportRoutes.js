const express = require("express");
const {  
  createImportRequest,
  getImportRequests,
  getImportRequestById,
  updateImportRequest,
  deleteImportRequest} = require("../controller/ImportExportController");
const multerUpload = require("../middleware/multer");
const protect = require("../middleware/authenticationMW");


const router = express.Router();
// router.put("/convert/:id" , protect , sendSharedPropertyAsProject)
router.route("/").post( createImportRequest).get(getImportRequests);
router.route("/:id").get(getImportRequestById).put( updateImportRequest).delete(deleteImportRequest);

module.exports = router;
