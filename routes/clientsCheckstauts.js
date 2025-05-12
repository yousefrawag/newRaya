const express = require("express");
const getCheckstauts = require("../controller/clientsChekstauts/getCheckstauts")
const Addcheckstauts = require("../controller/clientsChekstauts/Addcheckstauts")
const Deletecheckstauts = require("../controller/clientsChekstauts/Deletecheckstauts")
const Updatecheckstauts = require("../controller/clientsChekstauts/Updatecheckstauts")

const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router.route("/").get( getCheckstauts ).post(authorizationMW("canAddisvewied") , Addcheckstauts)
router.route("/:id").delete(authorizationMW("canDeleteisvewied") , Deletecheckstauts).put(authorizationMW("canEditisvewied") , Updatecheckstauts)
module.exports = router;