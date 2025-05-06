const express = require("express");
const AddRegion = require("../controller/regionController/AddRegion");
const GetAllRegions = require("../controller/regionController/getAllRegion");
const updateRegion = require("../controller/regionController/updateRegion");
const DeleteRegion = require("../controller/regionController/DeleteRegion");
const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router
  .route("/")
  .post(authorizationMW("canAddAdministration"), AddRegion)
  .get( GetAllRegions);
router
  .route("/:id")
  .put(authorizationMW("canEditAdministration"), updateRegion)
  .delete(authorizationMW("canDeleteAdministration"), DeleteRegion);
module.exports = router;
