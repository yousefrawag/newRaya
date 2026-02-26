const express = require("express");
const {AddDealyReport , UpdateDealy, GetUserReports,DelateOne , GetAllReports , GetByid , GetCustomerByid} = require("../controller/brokerDeailyReportControler")
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
  router.get("/customer/:id" , GetCustomerByid)
router
  .route("/:id")
  .put( UpdateDealy)
  .delete( DelateOne)
  .get(GetByid)
module.exports = router;
