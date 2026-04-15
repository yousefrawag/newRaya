const express = require("express");
const GetAllPlications = require("../controller/jopAplication/GetAllPlications")
const AddNewAplication = require("../controller/jopAplication/AddNewAplication")
const DeleateAplication = require("../controller/jopAplication/DeleateAplication")
const GetAplicationId = require("../controller/jopAplication/GetAplicationId")
const authorizationMW = require("../middleware/authorizationMW");
const updateAplication = require("../controller/jopAplication/updateAplication")
const protect = require("../middleware/authenticationMW")
const router = express.Router();

router.route("/").get(protect , GetAllPlications ).post(AddNewAplication)
router.route("/:id").delete(protect , authorizationMW("canDeleteappCurency") , DeleateAplication).get(protect , authorizationMW("canEditappCurency") , GetAplicationId).put(protect , authorizationMW("canEditappCurency") , updateAplication)
module.exports = router;