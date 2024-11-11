const express = require("express");
const router = express.Router();
const CompanyInlysis = require("../controller/CompanyController")

router.get("/" , CompanyInlysis)
module.exports = router