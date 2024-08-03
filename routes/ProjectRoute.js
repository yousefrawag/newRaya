const express = require("express");
const addProject = require("../controller/projectController/addProject");
const getProjects = require("../controller/projectController/getProjects");
const getProjectByID = require("../controller/projectController/getProjectByID");
const deleteProject = require("../controller/projectController/deleteProject");
const updateProject = require("../controller/projectController/updateProject");
const userProjects = require("../controller/projectController/userProjects");
const validationResult = require("../middleware/validations/validatorResult");
const {
  insert,
  update,
} = require("../middleware/validations/projectValidator");
const authorizationMW = require("../middleware/authorizationMW");
const multerUpload = require("../middleware/multer");

const router = express.Router();

router
  .route("/users/:id")
  .get(authorizationMW("canViewUserProjects"), userProjects);
router
  .route("/")
  .get(authorizationMW("canViewAllProjects"), getProjects)
  .post(
    authorizationMW("canAddProject"),
    multerUpload.array("files"),
    insert,
    validationResult,
    addProject
  )
  .put(
    authorizationMW("canUpdateProject"),
    multerUpload.array("files"),
    update,
    validationResult,
    updateProject
  );

router
  .route("/:id")
  .get(authorizationMW("canViewProjectByID"), getProjectByID)
  .delete(authorizationMW("canDeleteProject"), deleteProject);
module.exports = router;
