const express = require("express");
const Getallclientstauts = require("../controller/Clientstauts/Getallclientstauts")
const AddNewstauts = require("../controller/Clientstauts/AddNewstauts")
const Deletestauts = require("../controller/Clientstauts/Deletestauts")
const Updatestauts = require("../controller/Clientstauts/Updatestauts")

const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router.route("/").get( Getallclientstauts ).post(authorizationMW("canAddAdministration") , AddNewstauts)
router.route("/:id").delete(authorizationMW("canDeleteAdministration") , Deletestauts).put(authorizationMW("canEditAdministration") , Updatestauts)
module.exports = router;