const express = require("express");
const getAllCurrency = require("../controller/currency/getAllcurrency")
const Addcurrency = require("../controller/currency/addCurrency")
const DeleteCurrency = require("../controller/currency/DeleteCurrency")
const updateCurrency = require("../controller/currency/updateCurrency")
const SinagleCurrency = require("../controller/currency/SingaleCurrency")
const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router.route("/").get( getAllCurrency ).post(authorizationMW("canAddappCurency") , Addcurrency)
router.route("/:id").delete(authorizationMW("canDeleteappCurency") , DeleteCurrency).put(authorizationMW("canEditappCurency") , updateCurrency).get(SinagleCurrency)
module.exports = router;