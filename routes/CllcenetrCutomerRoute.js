const express = require("express");
const Callcentercustomerstauts = require("../controller/CallcenterCustomer/Callcentercustomerstauts")
const AddNewstauts = require("../controller/CallcenterCustomer/AddNew")
const Deletestauts = require("../controller/CallcenterCustomer/Deleate")
const Updatestauts = require("../controller/CallcenterCustomer/Update")

const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router.route("/").get(authorizationMW("canAddCustomerTypes") ,  Callcentercustomerstauts ).post(authorizationMW("canAddCustomerTypes") , AddNewstauts)
router.route("/:id").delete(authorizationMW("canDeleteCustomerTypes") , Deletestauts).put(authorizationMW("canEditCustomerTypes") , Updatestauts)
module.exports = router;