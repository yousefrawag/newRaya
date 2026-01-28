const express = require("express");
const AddRegion = require("../controller/regionController/AddRegion");
const GetAllRegions = require("../controller/regionController/getAllRegion");
const updateRegion = require("../controller/regionController/updateRegion");
const DeleteRegion = require("../controller/regionController/DeleteRegion");
const GetallRegionArchiev = require("../controller/regionController/GetallRegionArchiev")
const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router
  .route("/")
  .post(authorizationMW("canAddprojectstypes"), AddRegion)
  .get( GetAllRegions);
  router.get("/archiev" , GetallRegionArchiev)
router
  .route("/:id")
  .put(authorizationMW("canEditprojectstypes"), updateRegion)
  .delete(authorizationMW("canDeleteprojectstypes"), DeleteRegion);
module.exports = router;
