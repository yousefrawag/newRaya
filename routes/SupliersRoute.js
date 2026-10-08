const express = require("express");
const {  createSupplier,
  updateSupplier,
  deleteSupplier,
  getAllSuppliers ,
  getSupplierById} = require("../controller/SpuilersControllers")


const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router.route("/").get(authorizationMW("canViewdministration")  ,  getAllSuppliers ).post(authorizationMW("canAddAdministration") , createSupplier)
router.route("/:id").delete(authorizationMW("canDeleteAdministration") , deleteSupplier).put(authorizationMW("canEditAdministration") , updateSupplier).get(authorizationMW("canViewdministration")  ,  getSupplierById)
module.exports = router;