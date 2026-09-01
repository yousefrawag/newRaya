const express = require("express");
const Addlocation = require("../controller/projectlocation/Addlocation");
const Getprojectlocation = require("../controller/projectlocation/Getprojectlocation");
const updateLocation = require("../controller/projectlocation/updateLocation");
const Deletelocation = require("../controller/projectlocation/Deletelocation");
const authorizationMW = require("../middleware/authorizationMW");
const LocationArchievd = require("../controller/projectlocation/LocationArchievd")
const protect = require("../middleware/authenticationMW")
const router = express.Router();

router.get("/archiev" , protect,  LocationArchievd)
router
  .route("/")
  .post(protect , authorizationMW("canAddlocation"), Addlocation)
  .get( Getprojectlocation);
router
  .route("/:id")
  .put(protect , authorizationMW("canEditlocation"), updateLocation)
  .delete(protect , authorizationMW("canDeletelocation"), Deletelocation);
module.exports = router;
