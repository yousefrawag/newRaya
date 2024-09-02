const express = require("express");
const addProject = require("../controller/projectController/addProject");
const getProjects = require("../controller/projectController/getProjects");
const getProjectByID = require("../controller/projectController/getProjectByID");
const deleteProject = require("../controller/projectController/deleteProject");
const updateProject = require("../controller/projectController/updateProject");
const userProjects = require("../controller/projectController/userProjects");
const selectProject = require("../controller/projectController/selectProject")
const validationResult = require("../middleware/validations/validatorResult");
const {
  insert,
  update,
} = require("../middleware/validations/projectValidator");
const authorizationMW = require("../middleware/authorizationMW");
const multerUpload = require("../middleware/multer");
const projectsAddedToday = require("../controller/projectController/projectsAddedToday");

const router = express.Router();

router.route("/users/:id").get(userProjects);
router.route("/projectsToday").get(projectsAddedToday);
router
  .route("/")
  .get(authorizationMW("canViewProjects") , getProjects)
  .post(
    authorizationMW("canAddProjects"),
    multerUpload.array("files"),
    addProject
  );
router.get("/selectproject" ,selectProject)
router
  .route("/:id")
  .put(
    authorizationMW("canEditProjects"),
    multerUpload.array("files"),
    update,
    validationResult,
    updateProject
  )
  .get(authorizationMW("canViewProjects"), getProjectByID)
  .delete(authorizationMW("canDeleteProjects"), deleteProject);
module.exports = router;
