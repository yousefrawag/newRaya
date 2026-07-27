const express = require("express");
const {addNew , Updateone , Deleateone ,  getAll , getOne} = require("../controller/InstitutionsCompanyController")

const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router.route("/").get( getAll ).post(authorizationMW("canAddappCurency") , addNew)
router.route("/:id").delete(authorizationMW("canDeleteappCurency") , Deleateone).put(authorizationMW("canEditappCurency") , Updateone).get(authorizationMW("canEditappCurency") , getOne)
module.exports = router;