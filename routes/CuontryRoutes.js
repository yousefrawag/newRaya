
const express = require("express");
const GetAllcountry = require("../controller/country/GetAllcountry")
const AddCountry = require("../controller/country/AddCountry")
const DeleteCountry = require("../controller/country/DeleteCountry")
const updateCountry = require("../controller/country/updateCountry")
const SingaleCountry = require("../controller/country/SingaleCountry")
const authorizationMW = require("../middleware/authorizationMW");
const router  = express.Router()
router.route("/").get( authorizationMW("canViewAdministration") , GetAllcountry ).post(authorizationMW("canAddAdministration") , AddCountry)
router.route("/:id").delete(authorizationMW("canDeleteAdministration") , DeleteCountry).put(authorizationMW("canEditAdministration") , updateCountry).get( authorizationMW("canViewAdministration") ,SingaleCountry)
module.exports = router;