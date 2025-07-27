const express = require("express");
const AddDealyReport = require("../controller/EmployeeDealyReports/AddDealyReport");
const GetAllReports = require("../controller/EmployeeDealyReports/GetAllReports");
const GetUserReports = require("../controller/EmployeeDealyReports/GetUserReports");
const Deletelocation = require("../controller/projectlocation/Deletelocation");
const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router
  .route("/")
  .post( AddDealyReport)
  .get( GetAllReports);
  router.get("/user" , GetUserReports)
// router
//   .route("/:id")
//   .put(authorizationMW("canEditlocation"), updateLocation)
//   .delete(authorizationMW("canDeletelocation"), Deletelocation);
module.exports = router;
