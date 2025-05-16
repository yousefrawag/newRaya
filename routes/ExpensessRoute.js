const express = require("express");
const Getexpenss = require("../controller/expensess/Getexpenss")
const addExpenses = require("../controller/expensess/addExpenses")
const DeleteExpenses = require("../controller/expensess/DeleteExpenses")
const Updateexpenss = require("../controller/expensess/Updateexpenss")
const UserExpensess = require("../controller/expensess/UserExpensess")
const authorizationMW = require("../middleware/authorizationMW");
const protect = require("../middleware/authenticationMW")
const router = express.Router();
router.use(protect)
router.route("/").get( Getexpenss ).post(authorizationMW("canAddexpensee") , addExpenses)
router.route("/:id").delete(authorizationMW("canDeleteexpensee") , DeleteExpenses).put(authorizationMW("canEditexpensee") , Updateexpenss).get(UserExpensess)
module.exports = router;