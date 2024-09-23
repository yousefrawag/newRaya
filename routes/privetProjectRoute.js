const express = require("express")
const addProject = require("../controller/privetProject/Addproject");
const getProjects = require("../controller/privetProject/GetallProjects");
const getProjectByID = require("../controller/privetProject/GetProjectByid");
const deleteProject = require("../controller/privetProject/DeleteProject");
const updateProject = require("../controller/privetProject/updateProject");
// const userProjects = require("../controller/projectController/userProjects");
// const UinqDataProject = require("../controller/projectController/UinqDataProject")
const selectProject = require("../controller/privetProject/selectprivetproject")
const authorizationMW = require("../middleware/authorizationMW");
const multerUpload = require("../middleware/multer");
const router = express.Router()
router
  .route("/")
  .get(authorizationMW("canViewPrivetProjects") , getProjects)
  .post(
    authorizationMW("canViewPrivetProjects"),
    multerUpload.array("files"),
    addProject
  );
router.get("/selectproject" ,selectProject)
// router.get("/uinqData" , UinqDataProject)
router
  .route("/:id")
  .put(
    authorizationMW("canEditPrivetProjects"),
    multerUpload.array("files"),
    updateProject
  )
  .get(authorizationMW("canViewPrivetProjects"), getProjectByID)
  .delete(authorizationMW("canDeletePrivetProjects"), deleteProject);
module.exports = router