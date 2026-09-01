const express = require("express");
const { getAllProperties , getProperty , deleteProperty , updateProperty , createProperty } = require("../controller/SharedPropertyController");

const router = express.Router();

router.route("/").post(createProperty).get(getAllProperties);
router.route("/:id").get(getProperty).put(updateProperty).delete(deleteProperty);

module.exports = router;
