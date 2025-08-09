const express = require("express");
const AddDealyReport = require("../controller/EmployeeDealyReports/AddDealyReport");
const GetAllReports = require("../controller/EmployeeDealyReports/GetAllReports");
const GetUserReports = require("../controller/EmployeeDealyReports/GetUserReports");
const DelateOne = require("../controller/EmployeeDealyReports/DelateOne");
const UpdateOne = require("../controller/EmployeeDealyReports/UpdateOne");
const GetByid = require("../controller/EmployeeDealyReports/GetByid");
const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const multerUpload = require("../middleware/multer");

const router = express.Router();
router.use(protect)
router
  .route("/")
  .post( multerUpload.array("files"), AddDealyReport)
  .get( GetAllReports);
  router.get("/user" , GetUserReports)
router
  .route("/:id")
  .put( UpdateOne)
  .delete( DelateOne)
  .get(GetByid)
module.exports = router;
