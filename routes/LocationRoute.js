const express = require("express");
const Addlocation = require("../controller/projectlocation/Addlocation");
const Getprojectlocation = require("../controller/projectlocation/Getprojectlocation");
const updateLocation = require("../controller/projectlocation/updateLocation");
const Deletelocation = require("../controller/projectlocation/Deletelocation");
const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router
  .route("/")
  .post(authorizationMW("canAddAdministration"), Addlocation)
  .get( Getprojectlocation);
router
  .route("/:id")
  .put(authorizationMW("canEditAdministration"), updateLocation)
  .delete(authorizationMW("canDeleteAdministration"), Deletelocation);
module.exports = router;
