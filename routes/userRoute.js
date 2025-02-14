const express = require("express");
const userController = require("../controller/userController");
const validationResult = require("../middleware/validations/validatorResult");
const { insert, update } = require("../middleware/validations/userValidator");
const authorizationMW = require("../middleware/authorizationMW");
const multerUpload = require("../middleware/multer");
const protect = require("../middleware/authenticationMW")

const router = express.Router();
router.use(protect)
router.route("/getCurrentLoggedUser").get(userController.getCurrentLoggedUser);
router.route("/changePassword").post(userController.changePassword);
router
  .route("/update")
  .put(
    multerUpload.single("image"),
  
    userController.updateUserOwnInfo
  );
router
  .route("/")
  .get(
    authorizationMW("canViewEmployees"),
   userController.getUsers)
  .post(
    authorizationMW("canAddEmployees"),
    multerUpload.single("image"),
    // insert,
    // validationResult,
    userController.addUser
  );
router.get("/selectusers" ,userController.Selectusers)
router.get("/admins" , userController.getusersAdmin)
router
  .route("/:id")
  .put(
    authorizationMW("canEditEmployees"),
    multerUpload.single("image"),
    // update,
    // validationResult,
    userController.updateUser
  )
  .get(userController.getUserById)
  .delete(
    authorizationMW("canDeleteEmployees"), 
  userController.deleteUser);
module.exports = router;
