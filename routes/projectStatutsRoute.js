const express = require("express");
const AddprojectStatuts = require("../controller/projectSatautsController/AddprojectStatuts");
const GetallStauts = require("../controller/projectSatautsController/GetallStauts");
const updateStatuts = require("../controller/projectSatautsController/updateStatuts");
const DeleteStatuts = require("../controller/projectSatautsController/DeleteStatuts");
const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")

const router = express.Router();
router.use(protect)
router
  .route("/")
  .post(authorizationMW("canAddAdministration"), AddprojectStatuts)
  .get( GetallStauts);
router
  .route("/:id")
  .put(authorizationMW("canEditAdministration"), updateStatuts)
  .delete(authorizationMW("canDeleteAdministration"), DeleteStatuts);
module.exports = router;
