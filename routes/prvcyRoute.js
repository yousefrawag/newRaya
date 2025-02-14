const express = require("express");
const {PrivcyControllerUpdate , PrivcyControlleGet} = require("../controller/PrivcyController")
const router  = express.Router()
router.route("/").get( PrivcyControlleGet )
router.route("/:id").put(PrivcyControllerUpdate)
module.exports = router;