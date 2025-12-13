const express = require("express");
const {addNew , getAll , Updateone , Deleateone } = require("../controller/FirstPaymentcontroller");

const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router
  .route("/")
  .post(authorizationMW("canAddlocation"), addNew)
  .get( getAll);
router
  .route("/:id")
  .put(authorizationMW("canEditlocation"), Updateone)
  .delete(authorizationMW("canDeletelocation"), Deleateone);
module.exports = router;
