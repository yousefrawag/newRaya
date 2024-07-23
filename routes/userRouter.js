const express = require("express");
const router = express.Router();
const {getUsers  , login , logout}  = require('../controler/userControle')
router.route('/users').get( getUsers )
// router.route('/add-employer').post(reqister)
router.route("/login").post(login)
router.route("/logout").post(logout)
module.exports = router