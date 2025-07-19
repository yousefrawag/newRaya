const express = require("express");
const Getall = require("../controller/ClientRequiremnts/Getall")
const Addnew = require("../controller/ClientRequiremnts/Addnew")
const DeleteClientRequiremnt = require("../controller/ClientRequiremnts/DeleteClientRequiremnt")
const updateone = require("../controller/ClientRequiremnts/updateone")

const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router.route("/").get(  Getall ).post(authorizationMW("canAddrequiremnts") , Addnew)
router.route("/:id").delete(authorizationMW("canDeleterequiremnts") , DeleteClientRequiremnt).put(authorizationMW("canEditrequiremnts") , updateone)
module.exports = router;