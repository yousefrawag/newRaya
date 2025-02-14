const express = require("express");
const { addSection , getAllSections , updateSection , deleteSection , getSectionById } = require("../controller/SectionController");

const router = express.Router();

router.route("/").post(addSection).get(getAllSections);
router.route("/:id").get(getSectionById).put(updateSection).delete(deleteSection);

module.exports = router;
