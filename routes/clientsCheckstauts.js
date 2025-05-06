const express = require("express");
const getCheckstauts = require("../controller/clientsChekstauts/getCheckstauts")
const Addcheckstauts = require("../controller/clientsChekstauts/Addcheckstauts")
const Deletecheckstauts = require("../controller/clientsChekstauts/Deletecheckstauts")
const Updatecheckstauts = require("../controller/clientsChekstauts/Updatecheckstauts")

const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router.route("/").get( getCheckstauts ).post(authorizationMW("canAddAdministration") , Addcheckstauts)
router.route("/:id").delete(authorizationMW("canDeleteAdministration") , Deletecheckstauts).put(authorizationMW("canEditAdministration") , Updatecheckstauts)
module.exports = router;