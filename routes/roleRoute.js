const express = require("express");
const {
  getAllRoles,
  getRoleById,
  addRole,
  updateRole,
  deleteRole,
  getRolesWithUserCounts,
  getUsersWithCertainRole,
} = require("../controller/roleController");
const validationResult = require("../middleware/validations/validatorResult");
const { insert, update } = require("../middleware/validations/roleValidator");
const authorizationMW = require("../middleware/authorizationMW");

const router = express.Router();

router.route("/getRolesWithUserCounts").get(getRolesWithUserCounts);
router.route("/getUsersWithCertainRole/:id").get(getUsersWithCertainRole);
router
  .route("/")
  .get(authorizationMW("canViewAllRoles"), getAllRoles)
  .post(authorizationMW("canAddRole"), insert, validationResult, addRole)
  .put(authorizationMW("canUpdateRole"), update, validationResult, updateRole);

router
  .route("/:id")
  .get(authorizationMW("canViewRoleByID"), getRoleById)
  .delete(authorizationMW("canDeleteRole"), deleteRole);

module.exports = router;
