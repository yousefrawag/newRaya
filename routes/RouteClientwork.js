const express = require("express");
const {  AddWork ,
    DeleteWork ,
    getAllWorks ,
    updatework} = require("../controller/ClientWork/index");

const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router
  .route("/")
  .post(authorizationMW("canAddwork"), AddWork)
  .get( getAllWorks);
router
  .route("/:id")
  .put(authorizationMW("canEditwork"), updatework)
  .delete(authorizationMW("canDeletework"), DeleteWork);
module.exports = router;
