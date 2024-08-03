const express = require("express");
const userController = require("../controller/userController");
const validationResult = require("../middleware/validations/validatorResult");
const { insert, update } = require("../middleware/validations/userValidator");
const authorizationMW = require("../middleware/authorizationMW");
const multerUpload = require("../middleware/multer");

const router = express.Router();
router
  .route("/changePassword")
  .post(authorizationMW("canChangePassword"), userController.changePassword);

router
  .route("/")
  .get(authorizationMW("canViewALLUsers"), userController.getUsers)
  .post(
    authorizationMW("canAddUser"),
    multerUpload.single("image"),
    insert,
    validationResult,
    userController.addUser
  )
  .put(
    authorizationMW("canUpdateUser"),
    multerUpload.single("image"),
    update,
    validationResult,
    userController.updateUser
  );

router
  .route("/:id")
  .get(authorizationMW("canViewUserByID"), userController.getUserById)
  .delete(authorizationMW("canDeleteUser"), userController.deleteUser);
module.exports = router;
