const express = require("express");
const addMission = require("../controller/missions/addMission");
const getAllMissions = require("../controller/missions/getAllMissions");
const updateMission = require("../controller/missions/updateMission");
const deleteMission = require("../controller/missions/deleteMission");
const getMissionByID = require("../controller/missions/getMissionByID");
const userMissions = require("../controller/missions/userMissions");
const validationResult = require("../middleware/validations/validatorResult");
const {
  insert,
  update,
} = require("../middleware/validations/missionValidator");
const authorizationMW = require("../middleware/authorizationMW");

const router = express.Router();

router
  .route("/users/:id")
  .get(authorizationMW("canViewUserMissions"), userMissions);

router
  .route("/")
  .get(authorizationMW("canViewAllMissions"), getAllMissions)
  .post(authorizationMW("canAddMission"), insert, validationResult, addMission)
  .put(
    authorizationMW("canUpdateMission"),
    update,
    validationResult,
    updateMission
  );

router
  .route("/:id")
  .get(authorizationMW("canViewMissionByID"), getMissionByID)
  .delete(authorizationMW("canDeleteMission"), deleteMission);

module.exports = router;
