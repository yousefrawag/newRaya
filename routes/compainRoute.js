const express = require("express");
const {createCampaign , addCustomers , sendCampaign , getAllcompain} = require("../controller/compaign/CreateCompain")
const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router.route("/").post( createCampaign).get(getAllcompain)
router.post("/addcustomer" , addCustomers)
router.post("/notyfire" ,sendCampaign)
module.exports = router;