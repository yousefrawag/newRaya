const express = require("express");
const {GetAllPlications ,AddNewAplication , DeleateAplication ,GetAplicationId , updateAplication } = require("../controller/SurveyAplication")

const authorizationMW = require("../middleware/authorizationMW");

const protect = require("../middleware/authenticationMW")
const router = express.Router();

router.route("/").get(protect , GetAllPlications ).post(AddNewAplication)
router.route("/:id").delete(protect , authorizationMW("canDeleteappCurency") , DeleateAplication).get(protect , authorizationMW("canEditappCurency") , GetAplicationId).put(protect , authorizationMW("canEditappCurency") , updateAplication)
module.exports = router;